"use server";

import type { WaitlistState } from "@/lib/waitlist";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _previous: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error" };
  }

  // TODO: store the address once a waitlist service is chosen. Until then
  // nothing is saved.
  return { status: "success" };
}
