import { GoogleGenAI, type Content } from "@google/genai";
import { z } from "zod";
import { env } from "../env";
import { HttpError } from "../http";

/*
 * Gemini, the AI engine of the whole platform: every AI step goes through
 * the two functions below. Each call walks a list of models: when one is
 * overloaded or out of quota, the next one answers.
 */

let client: GoogleGenAI | undefined;
const gemini = () => (client ??= new GoogleGenAI({ apiKey: env.geminiKey }));

/*
 * Worth trying the next model or pass for: rate limits, server overload, and
 * anything with no HTTP status at all (a plain network failure - DNS,
 * connect timeout, reset - never even reached Google). A genuine 4xx from
 * the API itself (bad request, bad key) is not: it would fail the same way
 * everywhere, so it is thrown straight through instead of being masked by a
 * generic "ai_busy" after silently exhausting every model.
 */
function isRetryable(error: unknown): boolean {
  const status = (error as { status?: unknown }).status;
  if (typeof status !== "number") return true;
  return status === 429 || status >= 500;
}

type FallbackOptions = {
  /* How many times to walk the whole model list before giving up */
  passes?: number;
  /* Longest one model may take to answer, so an overloaded one does not
     eat the whole budget before the next model gets a turn */
  timeoutMs?: number;
};

/* No retries inside one call: the SDK's own default (5 attempts with
   exponential backoff) can turn a single overloaded model into a
   30-second wait on its own. withFallbacks owns all the retrying instead,
   across models, so a busy model is skipped in a couple of seconds. */
const NO_RETRY = { attempts: 1 };

/*
 * Breadth first: try every model once before retrying any of them, so one
 * model stuck at 503 does not stall the whole request behind it.
 */
async function withFallbacks<T>(
  models: string[],
  run: (model: string, timeoutMs: number) => Promise<T>,
  { passes = 2, timeoutMs = 20_000 }: FallbackOptions = {},
): Promise<T> {
  let last: unknown;
  for (let pass = 0; pass < passes; pass++) {
    if (pass) await new Promise((resolve) => setTimeout(resolve, 1500));
    for (const model of models) {
      try {
        return await run(model, timeoutMs);
      } catch (error) {
        if (!isRetryable(error)) throw error;
        last = error;
      }
    }
  }
  throw last;
}

/* The JSON schema without the keywords Gemini's structured output may refuse */
function responseSchema(schema: z.ZodType) {
  const strip = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(strip);
    if (!node || typeof node !== "object") return node;
    return Object.fromEntries(
      Object.entries(node)
        .filter(([key]) => !["$schema", "pattern", "additionalProperties"].includes(key))
        .map(([key, value]) => [key, strip(value)]),
    );
  };
  return strip(z.toJSONSchema(schema));
}

type JsonRequest<T> = FallbackOptions & {
  schema: z.ZodType<T>;
  models: string[];
  /* Stable instructions first: Gemini caches repeated prefixes on its own */
  system: string;
  contents: string | Content[];
  /* Fixes small deviations (colors, ids) before validation */
  prepare?: (raw: unknown) => unknown;
};

/* An answer that must match a schema, validated before anything uses it */
export async function generateJson<T>({
  schema,
  models,
  system,
  contents,
  prepare,
  ...options
}: JsonRequest<T>): Promise<T> {
  const response = await withFallbacks(
    models,
    (model, timeout) =>
      gemini().models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: system,
          responseMimeType: "application/json",
          responseJsonSchema: responseSchema(schema),
          httpOptions: { timeout, retryOptions: NO_RETRY },
        },
      }),
    options,
  );

  const reason = response.candidates?.[0]?.finishReason;
  if (reason === "SAFETY" || reason === "PROHIBITED_CONTENT") throw new HttpError(422, "ai_refused");
  if (reason === "MAX_TOKENS") throw new HttpError(502, "ai_truncated");

  let raw: unknown;
  try {
    raw = JSON.parse(response.text ?? "");
  } catch {
    throw new HttpError(502, "ai_invalid_answer");
  }
  const parsed = schema.safeParse(prepare ? prepare(raw) : raw);
  if (!parsed.success) throw new HttpError(502, "ai_invalid_answer");
  return parsed.data;
}

/* One generated image, as bytes */
export async function generateImage(prompt: string): Promise<{ bytes: Buffer; type: string }> {
  const response = await withFallbacks(
    env.geminiImageModels,
    (model, timeout) =>
      gemini().models.generateContent({
        model,
        contents: prompt,
        config: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "3:2" },
          httpOptions: { timeout, retryOptions: NO_RETRY },
        },
      }),
    { passes: 1, timeoutMs: 30_000 },
  );
  const image = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data)?.inlineData;
  if (!image?.data) throw new HttpError(502, "ai_no_image");
  return { bytes: Buffer.from(image.data, "base64"), type: image.mimeType ?? "image/png" };
}
