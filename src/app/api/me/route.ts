import { z } from "zod";
import { configured, env } from "@/server/env";
import { getProfile } from "@/server/engine/data";
import { handle, HttpError, readBody, requireAccounts, requireUser } from "@/server/http";
import { supabaseAdmin } from "@/server/supabase";

const Body = z.object({
  profile: z
    .object({
      firstName: z.string().max(80),
      lastName: z.string().max(80),
      role: z.enum(["coach", "trainer", "creator", "entrepreneur", "other"]).nullable(),
      roleOther: z.string().max(120),
    })
    .partial()
    .optional(),
  brand: z
    .object({
      logo: z.string().max(2000).nullable(),
      photo: z.string().max(2000).nullable(),
      colors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).max(6),
      bio: z.string().max(600),
      cta: z.string().max(120),
      link: z.string().max(500),
    })
    .partial()
    .optional(),
  plan: z.enum(["free", "starter", "pro"]).optional(),
});

/* Profile, brand kit and plan */
export async function PATCH(request: Request) {
  return handle(async () => {
    requireAccounts();
    const user = await requireUser();
    const body = await readBody(request, Body);
    const current = await getProfile(user.id);
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.profile) {
      const { firstName, lastName, role, roleOther } = body.profile;
      if (firstName !== undefined) update.first_name = firstName;
      if (lastName !== undefined) update.last_name = lastName;
      if (role !== undefined) update.role = role;
      if (roleOther !== undefined) update.role_other = roleOther;
    }
    if (body.brand) update.brand = { ...current.brand, ...body.brand };
    if (body.plan) {
      // TODO: remove once the plan changes through Stripe checkout
      if (!env.allowPlanSwitch) throw new HttpError(403, "plan_change_disabled");
      update.plan = body.plan;
    }

    const { error } = await supabaseAdmin().from("profiles").update(update).eq("id", user.id);
    if (error) throw error;
    return { ok: configured.supabase };
  });
}
