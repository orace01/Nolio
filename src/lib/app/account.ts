import type { Tier } from "./catalog";

export type Plan = "free" | "starter" | "pro";

export const PLANS: Plan[] = ["free", "starter", "pro"];

/* Monthly prices in euros, as on the site's pricing page */
export const PLAN_PRICES: Record<Plan, number> = { free: 0, starter: 12, pro: 29 };

/* The answers to "What describes you best?" on the welcome screen */
export type RoleId = "coach" | "trainer" | "creator" | "entrepreneur" | "other";

export const ROLES: RoleId[] = ["coach", "trainer", "creator", "entrepreneur", "other"];

/*
 * Stand-in for the signed-in user until accounts are connected.
 * TODO: read the real profile and plan from the session.
 */
export const DEMO_ACCOUNT = {
  firstName: "Camille",
  lastName: "Martin",
  email: "camille.martin@example.com",
  plan: "free" as Plan,
};

/* Ebooks each plan may create: in total on Free, per month on the paid plans */
export const PLAN_EBOOKS: Record<Plan, number> = { free: 1, starter: 3, pro: 10 };

const ALLOWED: Record<Plan, Tier[]> = {
  free: ["basic"],
  starter: ["basic", "premium"],
  pro: ["basic", "premium", "pro"],
};

export function canUse(tier: Tier, plan: Plan) {
  return ALLOWED[plan].includes(tier);
}

/* The cheapest plan that unlocks a tier */
export function planFor(tier: Tier): Plan {
  return tier === "basic" ? "free" : tier === "premium" ? "starter" : "pro";
}

export function usedQuota(ebooks: { createdAt: number }[], plan: Plan, now: number) {
  if (plan === "free") return ebooks.length;
  const today = new Date(now);
  return ebooks.filter((ebook) => {
    const created = new Date(ebook.createdAt);
    return created.getFullYear() === today.getFullYear() && created.getMonth() === today.getMonth();
  }).length;
}

export function initials(firstName: string, lastName: string) {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() || "N";
}
