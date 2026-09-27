/*
 * What an ebook can be made of: styles, color themes, tones, illustrations
 * and lengths. The styles are examples until the real ones come from the
 * back end; everything is keyed by id so the list can be swapped as data.
 */

import type { Locale } from "@/i18n/config";

export type Localized = Record<Locale, string>;

/* Basic is free, Premium needs Starter or Pro, Pro needs Pro */
export type Tier = "basic" | "premium" | "pro";

export type StyleId = "monograph" | "botanica" | "notes" | "studio" | "editorial" | "gallery";

export const STYLES: { id: StyleId; name: Localized; description: Localized; tier: Tier }[] = [
  {
    id: "monograph",
    name: { en: "Monograph", fr: "Monographie" },
    description: { en: "Pure typography on a strict grid.", fr: "Typographie pure, grille stricte." },
    tier: "basic",
  },
  {
    id: "botanica",
    name: { en: "Botanica", fr: "Botanica" },
    description: { en: "Photographic and calm.", fr: "Photographique et calme." },
    tier: "basic",
  },
  {
    id: "notes",
    name: { en: "Field notes", fr: "Carnet" },
    description: { en: "Light pages, made to be annotated.", fr: "Pages légères, pensées pour annoter." },
    tier: "basic",
  },
  {
    id: "studio",
    name: { en: "Studio", fr: "Studio" },
    description: { en: "Bold color blocks and giant numbers.", fr: "Aplats de couleur, chiffres géants." },
    tier: "premium",
  },
  {
    id: "editorial",
    name: { en: "Editorial", fr: "Éditorial" },
    description: { en: "Classic serif, magazine feel.", fr: "Serif classique, allure de magazine." },
    tier: "premium",
  },
  {
    id: "gallery",
    name: { en: "Gallery", fr: "Galerie" },
    description: {
      en: "Illustrations consistent from cover to cover.",
      fr: "Illustrations cohérentes d’un bout à l’autre.",
    },
    tier: "premium",
  },
];

/* Font keys map to the CSS variables declared in app/[lang]/app/fonts.ts */
export type FontKey =
  | "montserrat"
  | "sourceSerif"
  | "fraunces"
  | "inter"
  | "playfair"
  | "lato"
  | "dmSerif"
  | "dmSans";

export const FONT_NAMES: Record<FontKey, string> = {
  montserrat: "Montserrat",
  sourceSerif: "Source Serif",
  fraunces: "Fraunces",
  inter: "Inter",
  playfair: "Playfair Display",
  lato: "Lato",
  dmSerif: "DM Serif Display",
  dmSans: "DM Sans",
};

/* Weight of titles: display serifs look best lighter, DM Serif has a single weight */
export const TITLE_WEIGHTS: Record<FontKey, number> = {
  montserrat: 700,
  sourceSerif: 600,
  fraunces: 600,
  inter: 700,
  playfair: 600,
  lato: 700,
  dmSerif: 400,
  dmSans: 700,
};

export const FONT_VARIABLES: Record<FontKey, string> = {
  montserrat: "var(--font-montserrat)",
  sourceSerif: "var(--font-source-serif)",
  fraunces: "var(--font-fraunces)",
  inter: "var(--font-inter)",
  playfair: "var(--font-playfair)",
  lato: "var(--font-lato)",
  dmSerif: "var(--font-dm-serif)",
  dmSans: "var(--font-dm-sans)",
};

export type ThemeId = "forest" | "night" | "sand" | "earth" | "ink";

export type Theme = {
  id: ThemeId;
  name: Localized;
  colorName: Localized;
  accent: string;
  soft: string;
  paper: string;
  titleFont: FontKey;
  titleUppercase: boolean;
  bodyFont: FontKey;
  tier: Tier;
};

export const THEMES: Theme[] = [
  {
    id: "forest",
    name: { en: "Forest", fr: "Forêt" },
    colorName: { en: "Deep green", fr: "Vert profond" },
    accent: "#2a3f34",
    soft: "#d8cfc0",
    paper: "#f4f3ef",
    titleFont: "montserrat",
    titleUppercase: true,
    bodyFont: "sourceSerif",
    tier: "basic",
  },
  {
    id: "night",
    name: { en: "Night", fr: "Nuit" },
    colorName: { en: "Midnight blue", fr: "Bleu nuit" },
    accent: "#243a5e",
    soft: "#c9d3e3",
    paper: "#f4f3ef",
    titleFont: "fraunces",
    titleUppercase: false,
    bodyFont: "inter",
    tier: "basic",
  },
  {
    id: "sand",
    name: { en: "Sand", fr: "Sable" },
    colorName: { en: "Ochre", fr: "Ocre" },
    accent: "#8a6a22",
    soft: "#eadfc8",
    paper: "#f7f3ea",
    titleFont: "montserrat",
    titleUppercase: false,
    bodyFont: "lato",
    tier: "basic",
  },
  {
    id: "earth",
    name: { en: "Earth", fr: "Terre" },
    colorName: { en: "Terracotta", fr: "Terracotta" },
    accent: "#a4553a",
    soft: "#f0d9cc",
    paper: "#f7f2ec",
    titleFont: "playfair",
    titleUppercase: false,
    bodyFont: "lato",
    tier: "premium",
  },
  {
    id: "ink",
    name: { en: "Ink", fr: "Encre" },
    colorName: { en: "Deep black", fr: "Noir profond" },
    accent: "#1d1d1d",
    soft: "#d9d9d6",
    paper: "#f4f3ef",
    titleFont: "dmSerif",
    titleUppercase: false,
    bodyFont: "dmSans",
    tier: "premium",
  },
];

export type ToneId = "direct" | "warm" | "expert" | "inspiring";

/* The French samples also exist with "tu", for readers addressed informally */
export const TONES: { id: ToneId; name: Localized; sample: Localized; informal: string }[] = [
  {
    id: "direct",
    name: { en: "Direct and practical", fr: "Direct et pratique" },
    sample: {
      en: "“Close your inbox until 11 a.m. Here is how to hold on.”",
      fr: "« Fermez votre boîte mail jusqu’à 11 h. Voici comment tenir. »",
    },
    informal: "« Ferme ta boîte mail jusqu’à 11 h. Voici comment tenir. »",
  },
  {
    id: "warm",
    name: { en: "Warm and personal", fr: "Chaleureux et personnel" },
    sample: {
      en: "“I too used to start my days with my emails.”",
      fr: "« Moi aussi, j’ai longtemps commencé mes journées par mes emails. »",
    },
    informal: "« Moi aussi, j’ai longtemps commencé mes journées par mes emails. »",
  },
  {
    id: "expert",
    name: { en: "Expert and precise", fr: "Expert et précis" },
    sample: {
      en: "“Every interruption forces you to rebuild your train of thought.”",
      fr: "« Chaque interruption oblige à reconstruire son fil de pensée. »",
    },
    informal: "« Chaque interruption t’oblige à reconstruire ton fil de pensée. »",
  },
  {
    id: "inspiring",
    name: { en: "Inspiring", fr: "Inspirant" },
    sample: {
      en: "“What if the best hour of your day belonged to you again?”",
      fr: "« Et si la meilleure heure de votre journée vous appartenait à nouveau ? »",
    },
    informal: "« Et si la meilleure heure de ta journée t’appartenait à nouveau ? »",
  },
];

export type IllustrationId = "none" | "photos" | "icons" | "line" | "shapes" | "custom";

export const ILLUSTRATIONS: { id: IllustrationId; name: Localized; description: Localized; tier: Tier }[] = [
  {
    id: "none",
    name: { en: "None", fr: "Aucune" },
    description: { en: "Typography alone, very clean.", fr: "La typographie seule, très épurée." },
    tier: "basic",
  },
  {
    id: "photos",
    name: { en: "Photos", fr: "Photos" },
    description: { en: "Your photos or free stock images.", fr: "Vos photos ou des banques d’images libres." },
    tier: "basic",
  },
  {
    id: "icons",
    name: { en: "Icons", fr: "Icônes" },
    description: { en: "Line pictograms for each idea.", fr: "Des pictogrammes au trait pour chaque idée." },
    tier: "basic",
  },
  {
    id: "line",
    name: { en: "Line drawing", fr: "Dessin au trait" },
    description: { en: "Fine illustrations in the style of the ebook.", fr: "Des illustrations fines, dans le style de l’ebook." },
    tier: "premium",
  },
  {
    id: "shapes",
    name: { en: "Geometric shapes", fr: "Formes géométriques" },
    description: { en: "Simple flat shapes in the theme colors.", fr: "Des aplats simples, aux couleurs du thème." },
    tier: "premium",
  },
  {
    id: "custom",
    name: { en: "Made to measure", fr: "Style sur mesure" },
    description: { en: "Describe the style you want, AI creates it.", fr: "Décrivez le style voulu, l’IA le crée pour vous." },
    tier: "pro",
  },
];

export type LengthId = "short" | "medium" | "long";

export const LENGTHS: { id: LengthId; name: Localized; pages: Localized; description: Localized; tier: Tier }[] = [
  {
    id: "short",
    name: { en: "Short", fr: "Court" },
    pages: { en: "8 to 15 pages", fr: "8 à 15 pages" },
    description: {
      en: "A 10-minute read, ideal for a first contact.",
      fr: "Une lecture de 10 minutes, idéale pour un premier contact.",
    },
    tier: "basic",
  },
  {
    id: "medium",
    name: { en: "Medium", fr: "Moyen" },
    pages: { en: "15 to 25 pages", fr: "15 à 25 pages" },
    description: { en: "Room to go into each part.", fr: "La place pour détailler chaque partie." },
    tier: "premium",
  },
  {
    id: "long",
    name: { en: "Long", fr: "Long" },
    pages: { en: "30 to 40 pages", fr: "30 à 40 pages" },
    description: { en: "To go deep, exercises included.", fr: "Pour aller en profondeur, exercices compris." },
    tier: "premium",
  },
];

export function findById<T extends { id: string }>(items: readonly T[], id: string): T {
  return items.find((item) => item.id === id) ?? items[0];
}

/* "Your colors" (Pro): an accent and two fonts picked by the user, and the
   tints and case the design studio may add */
export type CustomTheme = {
  accent: string;
  titleFont: FontKey;
  bodyFont: FontKey;
  soft?: string;
  paper?: string;
  titleUppercase?: boolean;
};

export const DEFAULT_CUSTOM_THEME: CustomTheme = {
  accent: "#2a3f34",
  titleFont: "montserrat",
  bodyFont: "sourceSerif",
};

export type ThemeChoice = ThemeId | "custom";

/* What the pages of an ebook need from its theme, preset or custom */
export type Look = {
  accent: string;
  soft: string;
  paper: string;
  titleFont: FontKey;
  bodyFont: FontKey;
  titleUppercase: boolean;
  /* The leaf texture belongs to the green theme; other colors stay flat */
  textured: boolean;
};

/* The accent blended with white, for tints and secondary swatches */
function tint(hex: string, amount: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const channels = [value >> 16, (value >> 8) & 255, value & 255];
  return `#${channels
    .map((channel) => Math.round(channel + (255 - channel) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function resolveLook(choice: ThemeChoice, custom: CustomTheme): Look {
  if (choice === "custom") {
    return {
      accent: custom.accent,
      soft: custom.soft ?? tint(custom.accent, 0.78),
      paper: custom.paper ?? "#f4f3ef",
      titleFont: custom.titleFont,
      bodyFont: custom.bodyFont,
      titleUppercase: custom.titleUppercase ?? custom.titleFont === "montserrat",
      textured: false,
    };
  }
  const theme = findById(THEMES, choice);
  return {
    accent: theme.accent,
    soft: theme.soft,
    paper: theme.paper,
    titleFont: theme.titleFont,
    bodyFont: theme.bodyFont,
    titleUppercase: theme.titleUppercase,
    textured: theme.id === "forest",
  };
}

/* "Create my style" (Pro): page margins on top of the chosen layout */
export type Margins = "narrow" | "normal" | "wide";

export const MARGINS: { id: Margins; name: Localized }[] = [
  { id: "narrow", name: { en: "Narrow", fr: "Étroites" } },
  { id: "normal", name: { en: "Normal", fr: "Normales" } },
  { id: "wide", name: { en: "Wide", fr: "Larges" } },
];
