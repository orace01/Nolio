"use client";

import { useSyncExternalStore } from "react";
import { DEMO_ACCOUNT, type Plan, type RoleId } from "./account";
import { api, debounce, getRuntime } from "./api";
import { DEFAULT_DRAFT, reviveDraft, type Draft, type Ebook, type EbookComment } from "./model";

/*
 * The app's state: the ebook in progress, the created ebooks, the plan, the
 * profile and the brand kit. Components read it through useSyncExternalStore,
 * so the server render uses the defaults and the browser switches to the
 * stored values without a hydration mismatch.
 * With accounts (remote runtime), localStorage is only a cache: the state
 * comes from the server and every change is sent back to it. Without them
 * (demo), localStorage is the whole storage.
 */

export type { ChatMessage, Draft, Ebook, EbookComment, MediaItem } from "./model";
export { DEFAULT_DRAFT } from "./model";

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleId | null;
  roleOther: string;
};

export type Brand = {
  logo: string | null;
  photo: string | null;
  colors: string[];
  bio: string;
  cta: string;
  link: string;
};

export const DEFAULT_BRAND: Brand = {
  logo: null,
  photo: null,
  colors: [],
  bio: "",
  cta: "",
  link: "",
};

/* How long the simulated creation and the simulated fixes take */
export const CREATION_MS = 16_000;
export const FIXES_MS = 2_600;

type Listener = () => void;

function createStore<T>(key: string, fallback: T, revive: (raw: unknown) => T) {
  let cache: T | undefined;
  const listeners = new Set<Listener>();

  const read = (): T => {
    if (cache === undefined) {
      try {
        const raw = window.localStorage.getItem(key);
        cache = raw ? revive(JSON.parse(raw)) : fallback;
      } catch {
        cache = fallback;
      }
    }
    return cache;
  };

  const write = (value: T) => {
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private browsing or full storage: keep the value in memory only
    }
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    // The same account open in another tab
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      cache = undefined;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const use = () => useSyncExternalStore(subscribe, read, () => fallback);

  return { read, write, use };
}

const merge =
  <T extends object>(fallback: T) =>
  (raw: unknown): T =>
    raw && typeof raw === "object" ? { ...fallback, ...(raw as Partial<T>) } : fallback;

const draftStore = createStore("nolio.draft", DEFAULT_DRAFT, reviveDraft);

const ebookStore = createStore<Ebook[]>("nolio.ebooks", [], (raw) =>
  Array.isArray(raw) ? raw.map((ebook: Ebook) => ({ ...ebook, draft: reviveDraft(ebook.draft) })) : [],
);

const planStore = createStore<Plan>("nolio.plan", DEMO_ACCOUNT.plan, (raw) =>
  raw === "free" || raw === "starter" || raw === "pro" ? raw : DEMO_ACCOUNT.plan,
);

const DEFAULT_PROFILE: Profile = {
  firstName: DEMO_ACCOUNT.firstName,
  lastName: DEMO_ACCOUNT.lastName,
  email: DEMO_ACCOUNT.email,
  role: null,
  roleOther: "",
};

const profileStore = createStore("nolio.profile", DEFAULT_PROFILE, merge(DEFAULT_PROFILE));

const brandStore = createStore("nolio.brand", DEFAULT_BRAND, merge(DEFAULT_BRAND));

export function newId() {
  // randomUUID only exists on secure origins, not on a LAN address over http
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

/* The ebook in progress */

export const useDraft = draftStore.use;

let draftLang = "fr";

export function setDraftLang(lang: string) {
  draftLang = lang;
}

/* Every answer reaches the server, so the AI steps work from the latest dossier */
function syncDraft() {
  if (!getRuntime().remote) return;
  debounce("draft", () => {
    void api("/api/draft", { method: "PUT", body: { draft: draftStore.read(), lang: draftLang } }).catch(() => {
      // Kept locally; the next change sends it again
    });
  });
}

/* A patch, or a function of the latest draft for changes that finish later */
export function updateDraft(change: Partial<Draft> | ((draft: Draft) => Partial<Draft>)) {
  const current = draftStore.read();
  draftStore.write({ ...current, ...(typeof change === "function" ? change(current) : change) });
  syncDraft();
}

export function resetDraft(options: { keepOnServer?: boolean } = {}) {
  draftStore.write(DEFAULT_DRAFT);
  if (getRuntime().remote && !options.keepOnServer) void api("/api/draft", { method: "DELETE" }).catch(() => {});
}

/* Created ebooks */

export const useEbooks = ebookStore.use;

export function useEbook(id: string) {
  return useEbooks().find((ebook) => ebook.id === id);
}

export function readEbooks() {
  return ebookStore.read();
}

export function replaceEbooks(ebooks: Ebook[]) {
  ebookStore.write(ebooks);
}

/* "Approve and create": a job for the worker, or the simulated creation of the demo */
export async function createEbook(draft: Draft, lang: string): Promise<string> {
  if (getRuntime().remote) {
    const { ebook } = await api<{ ebook: Ebook }>("/api/ebooks", { body: { draft, lang } });
    ebookStore.write([ebook, ...ebookStore.read()]);
    return ebook.id;
  }
  const now = Date.now();
  const ebook: Ebook = {
    id: newId(),
    createdAt: now,
    readyAt: now + CREATION_MS,
    draft,
    comments: [],
    lang,
  };
  ebookStore.write([ebook, ...ebookStore.read()]);
  return ebook.id;
}

export function updateEbook(id: string, change: (ebook: Ebook) => Partial<Ebook>) {
  ebookStore.write(
    ebookStore.read().map((ebook) => (ebook.id === id ? { ...ebook, ...change(ebook) } : ebook)),
  );
}

export async function refreshEbook(id: string) {
  const { ebook } = await api<{ ebook: Ebook }>(`/api/ebooks/${id}`);
  updateEbook(id, () => ebook);
}

export function deleteEbook(id: string) {
  ebookStore.write(ebookStore.read().filter((ebook) => ebook.id !== id));
  if (getRuntime().remote) void api(`/api/ebooks/${id}`, { method: "DELETE" }).catch(() => {});
}

export async function retryEbook(id: string) {
  await api(`/api/ebooks/${id}/retry`, { method: "POST" });
  updateEbook(id, () => ({ status: "queued", error: null, progress: { step: 0, ratio: 0 } }));
}

/* Comments on a finished ebook */

export async function addComment(id: string, comment: Omit<EbookComment, "id" | "appliedAt">) {
  if (getRuntime().remote) {
    const { comment: saved } = await api<{ comment: EbookComment }>(`/api/ebooks/${id}/comments`, {
      body: { page: comment.page, part: comment.part, text: comment.text },
    });
    updateEbook(id, (current) => ({ comments: [...current.comments, saved] }));
    return;
  }
  const local: EbookComment = { ...comment, id: newId(), appliedAt: null };
  updateEbook(id, (current) => ({ comments: [...current.comments, local] }));
}

export function removeComment(id: string, commentId: string) {
  updateEbook(id, (current) => ({ comments: current.comments.filter((comment) => comment.id !== commentId) }));
  if (getRuntime().remote) void api(`/api/ebooks/${id}/comments/${commentId}`, { method: "DELETE" }).catch(() => {});
}

export async function applyFixes(id: string) {
  if (getRuntime().remote) {
    await api(`/api/ebooks/${id}/fixes`, { method: "POST" });
    updateEbook(id, (current) => ({
      comments: current.comments.map((comment) =>
        comment.status === "pending" ? { ...comment, status: "applying" } : comment,
      ),
    }));
    return;
  }
  const at = Date.now() + FIXES_MS;
  updateEbook(id, (current) => ({
    comments: current.comments.map((comment) => (comment.appliedAt === null ? { ...comment, appliedAt: at } : comment)),
  }));
}

/* Plan, profile and brand kit */

export const usePlan = planStore.use;

// TODO: go through checkout once payments are connected
export function setPlan(plan: Plan) {
  planStore.write(plan);
  if (getRuntime().remote) void api("/api/me", { method: "PATCH", body: { plan } }).catch(() => {});
}

export const useProfile = profileStore.use;

export function updateProfile(patch: Partial<Profile>) {
  profileStore.write({ ...profileStore.read(), ...patch });
  if (!getRuntime().remote) return;
  debounce("profile", () => {
    const { firstName, lastName, role, roleOther } = profileStore.read();
    void api("/api/me", { method: "PATCH", body: { profile: { firstName, lastName, role, roleOther } } }).catch(() => {});
  });
}

export const useBrand = brandStore.use;

export function updateBrand(patch: Partial<Brand>) {
  brandStore.write({ ...brandStore.read(), ...patch });
  if (!getRuntime().remote) return;
  debounce("brand", () => void api("/api/me", { method: "PATCH", body: { brand: brandStore.read() } }).catch(() => {}));
}

/* The state saved on the server replaces the local cache when the app opens */
export async function loadRemoteState() {
  const state = await api<{
    profile: Profile;
    plan: Plan;
    brand: Brand;
    draft: unknown;
    ebooks: Ebook[];
  }>("/api/state");
  profileStore.write({ ...DEFAULT_PROFILE, ...state.profile });
  planStore.write(state.plan);
  brandStore.write({ ...DEFAULT_BRAND, ...state.brand });
  draftStore.write(state.draft ? reviveDraft(state.draft) : DEFAULT_DRAFT);
  ebookStore.write(state.ebooks.map((ebook) => ({ ...ebook, draft: reviveDraft(ebook.draft) })));
}

/* Something is running on the server and the screen should follow it */
export function hasWorkInProgress(ebooks: Ebook[]) {
  return ebooks.some(
    (ebook) =>
      ebook.status === "queued" ||
      ebook.status === "working" ||
      ebook.comments.some((comment) => comment.status === "applying"),
  );
}

/* True once the browser has taken over from the server render */

const noop = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/* The current time, refreshed twice a second while a component shows it */

let now = 0;
const clockListeners = new Set<Listener>();
let clock: ReturnType<typeof setInterval> | undefined;

function readClock() {
  if (now === 0) now = Date.now();
  return now;
}

function subscribeClock(listener: Listener) {
  clockListeners.add(listener);
  if (!clock) {
    now = Date.now();
    clock = setInterval(() => {
      now = Date.now();
      clockListeners.forEach((notify) => notify());
    }, 500);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clock) {
      clearInterval(clock);
      clock = undefined;
      now = 0;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribeClock, readClock, () => 0);
}
