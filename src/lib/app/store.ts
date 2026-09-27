"use client";

import { useSyncExternalStore } from "react";
import { DEMO_ACCOUNT, type Plan, type RoleId } from "./account";
import {
  DEFAULT_CUSTOM_THEME,
  type CustomTheme,
  type IllustrationId,
  type LengthId,
  type Margins,
  type StyleId,
  type ThemeChoice,
  type ToneId,
} from "./catalog";

/*
 * Front-end only persistence: the ebook in progress, the created ebooks, the
 * plan, the profile and the brand kit live in localStorage until the back end
 * exists. Components read them through useSyncExternalStore, so the server
 * render uses the defaults and the browser switches to the stored values
 * without a hydration mismatch.
 * TODO: replace with the API once accounts are connected.
 */

export type MediaItem = {
  id: string;
  kind: "video" | "link" | "file";
  title: string;
  url: string;
};

export type Draft = {
  idea: string;
  /* The idea as it was last analyzed, so the analysis only replays after a change */
  analyzed: string;
  audiences: string[];
  audienceOther: string;
  media: MediaItem[];
  length: LengthId;
  style: StyleId;
  /* "Create my style" (Pro): the chosen layout with the user's margins */
  ownStyle: boolean;
  margins: Margins;
  theme: ThemeChoice;
  customTheme: CustomTheme;
  tone: ToneId;
  address: "formal" | "informal";
  illustrations: IllustrationId;
  illustrationBrief: string;
  /* Imported photos, downscaled to data URLs */
  images: string[];
  aiPrompt: string;
  aiImages: number;
  /* The last creation step visited, where "Resume" leads */
  lastStep: string;
};

export const DEFAULT_DRAFT: Draft = {
  idea: "",
  analyzed: "",
  audiences: [],
  audienceOther: "",
  media: [],
  length: "short",
  style: "monograph",
  ownStyle: false,
  margins: "normal",
  theme: "forest",
  customTheme: DEFAULT_CUSTOM_THEME,
  tone: "direct",
  address: "formal",
  illustrations: "icons",
  illustrationBrief: "",
  images: [],
  aiPrompt: "",
  aiImages: 0,
  lastStep: "",
};

export type EbookComment = {
  id: string;
  page: number;
  /* The passage clicked on the page, or null for the whole page */
  part: string | null;
  text: string;
  /* Set when the fixes are requested; the fix counts as done once it is past */
  appliedAt: number | null;
};

export type Ebook = {
  id: string;
  createdAt: number;
  /* Creation is simulated: the ebook counts as ready from this moment */
  readyAt: number;
  draft: Draft;
  comments: EbookComment[];
};

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

const draftStore = createStore("nolio.draft", DEFAULT_DRAFT, merge(DEFAULT_DRAFT));

const ebookStore = createStore<Ebook[]>("nolio.ebooks", [], (raw) =>
  Array.isArray(raw)
    ? raw.map((ebook: Ebook) => ({ ...ebook, draft: { ...DEFAULT_DRAFT, ...ebook.draft } }))
    : [],
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

/* A patch, or a function of the latest draft for changes that finish later */
export function updateDraft(change: Partial<Draft> | ((draft: Draft) => Partial<Draft>)) {
  const current = draftStore.read();
  draftStore.write({ ...current, ...(typeof change === "function" ? change(current) : change) });
}

export function resetDraft() {
  draftStore.write(DEFAULT_DRAFT);
}

/* Created ebooks */

export const useEbooks = ebookStore.use;

export function useEbook(id: string) {
  return useEbooks().find((ebook) => ebook.id === id);
}

export function createEbook(draft: Draft): string {
  const now = Date.now();
  const ebook: Ebook = {
    id: newId(),
    createdAt: now,
    readyAt: now + CREATION_MS,
    draft,
    comments: [],
  };
  ebookStore.write([ebook, ...ebookStore.read()]);
  return ebook.id;
}

export function updateEbook(id: string, change: (ebook: Ebook) => Partial<Ebook>) {
  ebookStore.write(
    ebookStore.read().map((ebook) => (ebook.id === id ? { ...ebook, ...change(ebook) } : ebook)),
  );
}

export function deleteEbook(id: string) {
  ebookStore.write(ebookStore.read().filter((ebook) => ebook.id !== id));
}

/* Plan, profile and brand kit */

export const usePlan = planStore.use;

// TODO: go through checkout once payments are connected
export const setPlan = planStore.write;

export const useProfile = profileStore.use;

export function updateProfile(patch: Partial<Profile>) {
  profileStore.write({ ...profileStore.read(), ...patch });
}

export const useBrand = brandStore.use;

export function updateBrand(patch: Partial<Brand>) {
  brandStore.write({ ...brandStore.read(), ...patch });
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
