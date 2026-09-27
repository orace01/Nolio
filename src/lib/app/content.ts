/*
 * Stand-ins for the AI, used in demo mode or when a provider fails: the
 * analysis of an idea and the content of the ebook, in the same shapes as
 * the AI answers (see model.ts). The "focus method" example produces a
 * complete sample; any other idea gets a placeholder with the real layout.
 * Once the AI has answered, its analysis, outline and content win.
 */

import type { Locale } from "@/i18n/config";
import { outlineKey, type Analysis, type AudienceSuggestion, type Chapter, type Draft, type EbookContent } from "./model";

type BrandCta = { cta: string; link: string };

type Text = Record<Locale, string>;

/* ---------- Analysis of the idea ---------- */

/* The example offered on the idea screen, which leads to the full sample */
export const SAMPLE_IDEA: Text = {
  en: "A practical guide to help overwhelmed freelancers manage their time better. I want to present my 5 rituals, with a short video for each, and end with an invitation to book a discovery call with me.",
  fr: "Un guide pratique pour aider les indépendants débordés à mieux gérer leur temps. Je veux présenter mes 5 rituels, avec une courte vidéo pour chacun, et finir par une invitation à réserver un appel découverte avec moi.",
};

export function isSampleIdea(idea: string) {
  return /rituel|ritual/i.test(idea) && /temps|time/i.test(idea);
}

type BaseAnalysis = Pick<Analysis, "type" | "kind" | "subject" | "contents" | "goal" | "summary">;

const SAMPLE_ANALYSIS: Record<Locale, BaseAnalysis> = {
  fr: {
    type: "Un guide pratique en PDF",
    kind: "Guide",
    subject: "L’organisation du temps, en 5 rituels",
    contents: "Une courte vidéo par rituel",
    goal: "Obtenir des rendez-vous découverte",
    summary: "Un guide pratique pour mieux gérer son temps, en 5 rituels.",
  },
  en: {
    type: "A practical guide in PDF",
    kind: "Guide",
    subject: "Time management, in 5 rituals",
    contents: "A short video for each ritual",
    goal: "Get discovery calls booked",
    summary: "A practical guide to managing time better, in 5 rituals.",
  },
};

const TYPES: { match: RegExp; type: Text; kind: Text }[] = [
  {
    match: /checklist|liste/,
    type: { en: "A checklist in PDF", fr: "Une checklist en PDF" },
    kind: { en: "Checklist", fr: "Checklist" },
  },
  {
    match: /recette|recipe/,
    type: { en: "A recipe booklet in PDF", fr: "Un carnet de recettes en PDF" },
    kind: { en: "Recipe booklet", fr: "Carnet de recettes" },
  },
  {
    match: /formation|cours|course|training|atelier|workshop/,
    type: { en: "A course companion in PDF", fr: "Un support de cours en PDF" },
    kind: { en: "Course companion", fr: "Support de cours" },
  },
  {
    match: /./,
    type: { en: "A practical guide in PDF", fr: "Un guide pratique en PDF" },
    kind: { en: "Guide", fr: "Guide" },
  },
];

const GOALS: { match: RegExp; goal: Text }[] = [
  {
    match: /rendez-vous|appel|call|booking|book a/,
    goal: { en: "Get discovery calls booked", fr: "Obtenir des rendez-vous découverte" },
  },
  { match: /vend|sell|offre|offer|client/, goal: { en: "Sell your offer", fr: "Vendre votre offre" } },
  {
    match: /contact|e-?mail|newsletter|lead|abonn|subscri/,
    goal: { en: "Collect contacts", fr: "Récolter des contacts" },
  },
  { match: /./, goal: { en: "Pass on your method", fr: "Transmettre votre méthode" } },
];

function firstSentence(idea: string) {
  const sentence = idea.split(/[.!?\n]/)[0].trim();
  return sentence.length > 90 ? `${sentence.slice(0, 88).trim()}…` : sentence;
}

function baseAnalysis(idea: string, lang: Locale): BaseAnalysis {
  if (isSampleIdea(idea)) return SAMPLE_ANALYSIS[lang];

  const text = idea.toLowerCase();
  const found = TYPES.find((entry) => entry.match.test(text)) ?? TYPES[TYPES.length - 1];
  const goal = GOALS.find((entry) => entry.match.test(text)) ?? GOALS[GOALS.length - 1];
  const videos = /vid[eé]o/.test(text);
  const subject = firstSentence(idea) || (lang === "fr" ? "À préciser" : "To be specified");

  return {
    type: found.type[lang],
    kind: found.kind[lang],
    subject,
    contents: videos
      ? lang === "fr"
        ? "Des vidéos intégrées aux pages"
        : "Videos built into the pages"
      : lang === "fr"
        ? "Du texte, des exemples et des exercices"
        : "Text, examples and exercises",
    goal: goal.goal[lang],
    summary: subject.endsWith("…") || subject.endsWith(".") ? subject : `${subject}.`,
  };
}

const OPEN: Record<Locale, string[]> = {
  fr: ["Le public exact", "Les liens de vos vidéos", "La longueur de l’ebook"],
  en: ["The exact audience", "The links to your videos", "The length of the ebook"],
};

/* The stand-in analysis, in the shape the AI returns */
export function analyzeIdea(idea: string, lang: Locale): Analysis {
  const base = baseAnalysis(idea, lang);
  const sample = isSampleIdea(idea);
  return {
    ...base,
    refused: false,
    refusalReason: "",
    title: sample ? SAMPLE[lang].title : titleFromIdea(idea, PLACEHOLDER[lang].untitled),
    subtitle: sample ? SAMPLE[lang].subtitle : PLACEHOLDER[lang].subtitle,
    open: OPEN[lang],
    audiences: suggestAudiences(idea, lang),
    recommendedLength: /formation|cours|course|training/i.test(idea) ? "medium" : "short",
  };
}

/* The AI's analysis when there is one for the current idea, else the stand-in */
export function getAnalysis(draft: Draft, lang: Locale): Analysis {
  return draft.analysis && draft.analyzed === draft.idea.trim() ? draft.analysis : analyzeIdea(draft.idea, lang);
}

/* ---------- Audiences suggested from the idea ---------- */

type AudienceEntry = { id: string; name: Text; description: Text; match: RegExp };

const audience = (id: string, name: Text, description: Text, match: RegExp): AudienceEntry => ({
  id,
  name,
  description,
  match,
});

const AUDIENCE_FAMILIES: { match: RegExp; audiences: AudienceEntry[] }[] = [
  {
    match: /temps|productiv|organis|focus|rituel|time|routine|agenda/,
    audiences: [
      audience(
        "freelancers",
        { en: "Overwhelmed freelancers", fr: "Indépendants débordés" },
        {
          en: "Freelancers who work alone and chase their time.",
          fr: "Freelances qui travaillent seuls et courent après le temps.",
        },
        /ind[eé]pendant|freelance/,
      ),
      audience(
        "remote",
        { en: "Remote employees", fr: "Salariés en télétravail" },
        {
          en: "They organize their day alone, away from the office.",
          fr: "Ils organisent seuls leur journée, loin du bureau.",
        },
        /t[eé]l[eé]travail|remote/,
      ),
      audience(
        "owners",
        { en: "Small business owners", fr: "Dirigeants de petite entreprise" },
        {
          en: "They juggle running the business and their craft.",
          fr: "Ils jonglent entre la gestion et leur métier.",
        },
        /dirigeant|entreprise|business owner|founder/,
      ),
    ],
  },
  {
    match: /yoga|sport|sant[eé]|health|fitness|m[eé]ditation|meditation|bien-[eê]tre|wellness|posture/,
    audiences: [
      audience(
        "starters",
        { en: "Complete beginners", fr: "Grands débutants" },
        {
          en: "They have never practiced and want a gentle start.",
          fr: "Ils n’ont jamais pratiqué et veulent commencer en douceur.",
        },
        /d[eé]but|beginner|novice/,
      ),
      audience(
        "parents",
        { en: "Busy parents", fr: "Parents pressés" },
        { en: "Little time, plenty of goodwill.", fr: "Peu de temps, beaucoup de bonne volonté." },
        /parent|famille|family/,
      ),
      audience(
        "desk",
        { en: "Office workers", fr: "Travailleurs de bureau" },
        {
          en: "Sitting all day, they want to move more.",
          fr: "Assis toute la journée, ils veulent bouger plus.",
        },
        /bureau|office|desk/,
      ),
    ],
  },
  {
    match: /recette|cuisine|recipe|cooking|repas|meal/,
    audiences: [
      audience(
        "cooks",
        { en: "Everyday cooks", fr: "Cuisiniers du quotidien" },
        {
          en: "They cook every day and look for new ideas.",
          fr: "Ils cuisinent chaque jour et cherchent des idées.",
        },
        /quotidien|daily|everyday|saison|season/,
      ),
      audience(
        "families",
        { en: "Families", fr: "Familles" },
        { en: "Simple meals everyone enjoys.", fr: "Des repas simples que tout le monde aime." },
        /famille|family|enfant|kids/,
      ),
      audience(
        "students",
        { en: "Students", fr: "Étudiants" },
        { en: "A small budget and a small kitchen.", fr: "Un petit budget et une petite cuisine." },
        /[eé]tudiant|student/,
      ),
    ],
  },
  {
    match: /boutique|e-commerce|vendre|business|entreprise|shop|store|lancer|launch|client/,
    audiences: [
      audience(
        "founders",
        { en: "First-time founders", fr: "Créateurs d’entreprise" },
        {
          en: "They are starting out and want to avoid mistakes.",
          fr: "Ils se lancent et veulent éviter les erreurs.",
        },
        /lancer|launch|cr[eé]er|start/,
      ),
      audience(
        "makers",
        { en: "Makers and artisans", fr: "Artisans et créateurs" },
        { en: "They sell what they make.", fr: "Ils vendent ce qu’ils fabriquent." },
        /artisan|cr[eé]ateur|maker|handmade/,
      ),
      audience(
        "side",
        { en: "Employees with a side project", fr: "Salariés avec un projet" },
        {
          en: "They build their business on the side.",
          fr: "Ils préparent leur activité en parallèle.",
        },
        /salari[eé]|side|parall[eè]le/,
      ),
    ],
  },
];

const GENERAL_AUDIENCES: AudienceEntry[] = [
  audience(
    "beginners",
    { en: "Beginners", fr: "Débutants" },
    { en: "They are new to the topic.", fr: "Ils découvrent le sujet." },
    /d[eé]but|beginner/,
  ),
  audience(
    "amateurs",
    { en: "Keen amateurs", fr: "Amateurs éclairés" },
    {
      en: "They know the basics and want to improve.",
      fr: "Ils connaissent les bases et veulent progresser.",
    },
    /progress|am[eé]liorer|improve/,
  ),
  audience(
    "professionals",
    { en: "Professionals", fr: "Professionnels" },
    { en: "They look for precise methods.", fr: "Ils cherchent des méthodes précises." },
    /professionnel|professional/,
  ),
];

function suggestAudiences(idea: string, lang: Locale): AudienceSuggestion[] {
  const text = idea.toLowerCase();
  const family = AUDIENCE_FAMILIES.find((entry) => entry.match.test(text));
  const list = family?.audiences ?? GENERAL_AUDIENCES;
  return list.map((entry) => ({
    id: entry.id,
    name: entry.name[lang],
    description: entry.description[lang],
    fromIdea: entry.match.test(text),
  }));
}

/* ---------- Videos and links ---------- */

const VIDEO_HOSTS: { match: RegExp; name: string }[] = [
  { match: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/, name: "YouTube" },
  { match: /(^|\.)vimeo\.com$/, name: "Vimeo" },
  { match: /(^|\.)loom\.com$/, name: "Loom" },
  { match: /(^|\.)dailymotion\.com$/, name: "Dailymotion" },
  { match: /(^|\.)wistia\.(com|net)$/, name: "Wistia" },
];

/* The platform of a video link, or null for an ordinary web page */
export function videoSource(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    return VIDEO_HOSTS.find((entry) => entry.match.test(host))?.name ?? null;
  } catch {
    return null;
  }
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/* ---------- Content of the finished ebook ---------- */

export type { Chapter, EbookContent };

type SampleChapter = Omit<Chapter, "video">;

const SAMPLE: Record<Locale, { title: string; subtitle: string; chapters: SampleChapter[] }> = {
  fr: {
    title: "La méthode focus",
    subtitle: "5 rituels pour travailler moins et mieux",
    chapters: [
      {
        title: "Pourquoi vos journées vous échappent",
        short: "Introduction",
        intro: "Vous commencez la journée avec une liste claire, et vous la terminez avec l’impression d’avoir couru sans avancer.",
        paragraphs: [
          "Ce n’est pas un manque de volonté. Votre attention est découpée en morceaux par les emails, les notifications et les demandes des autres.",
          "Les cinq rituels qui suivent protègent le travail important avant que la journée ne s’emballe.",
        ],
      },
      {
        title: "Rituel 1 : la page du matin",
        short: "Rituel 1",
        intro: "Avant d’ouvrir vos emails, prenez dix minutes pour écrire ce qui compte vraiment aujourd’hui.",
        paragraphs: [
          "Pas une liste de tâches : une page, à la main, pour décider de ce qui rendra la journée réussie.",
          "Julien, graphiste indépendant, travaillait jusqu’à 21 h. Deux semaines après sa première page du matin, il fermait l’ordinateur à 18 h.",
        ],
        checklist: ["Écrire avant d’ouvrir l’ordinateur", "Trois phrases au maximum", "Relire la page à midi"],
      },
      {
        title: "Rituel 2 : les trois priorités",
        short: "Rituel 2",
        intro: "Choisissez trois tâches, pas une de plus.",
        paragraphs: [
          "Les autres attendront, et c’est très bien ainsi. Placez vos trois priorités avant midi, quand votre énergie est la plus haute.",
        ],
        box: { title: "À retenir", text: "Une priorité qui ne tient pas dans une phrase est un projet, pas une tâche." },
      },
      {
        title: "Rituel 3 : l’email en deux passages",
        short: "Rituel 3",
        intro: "Ouvrez votre messagerie à 11 h et à 16 h seulement.",
        paragraphs: [
          "Entre les deux, les notifications restent coupées. Prévenez vos clients de vos horaires : ils s’adaptent vite.",
        ],
        checklist: ["Notifications coupées", "Deux créneaux dans l’agenda", "Réponse type pour l’urgent"],
      },
      {
        title: "Rituel 4 : les blocs de concentration",
        short: "Rituel 4",
        intro: "Deux blocs de 50 minutes par jour, le téléphone dans une autre pièce.",
        paragraphs: ["Pendant un bloc, une seule tâche : celle que vous avez choisie le matin."],
        box: { title: "Astuce", text: "Notez les idées qui surgissent pendant un bloc, et traitez-les après." },
      },
      {
        title: "Rituel 5 : la revue du vendredi",
        short: "Rituel 5",
        intro: "Vingt minutes pour fermer la semaine.",
        paragraphs: [
          "Ce qui a marché, ce qui a coincé, ce qui vient. Vous commencez le lundi en sachant déjà où aller.",
        ],
        checklist: ["Trois réussites", "Un point à changer", "Les priorités de lundi"],
      },
      {
        title: "Votre plan sur 30 jours",
        short: "Plan sur 30 jours",
        intro: "Installez un rituel par semaine, pas tout d’un coup.",
        paragraphs: ["Au bout d’un mois, les cinq rituels tiennent en moins d’une heure par jour."],
        checklist: [
          "Semaine 1 : la page du matin",
          "Semaine 2 : les trois priorités",
          "Semaine 3 : l’email en deux passages",
          "Semaine 4 : les blocs et la revue",
        ],
      },
    ],
  },
  en: {
    title: "The focus method",
    subtitle: "5 rituals to work less and better",
    chapters: [
      {
        title: "Why your days slip away",
        short: "Introduction",
        intro: "You start the day with a clear list and end it feeling you ran without moving forward.",
        paragraphs: [
          "It is not a lack of willpower. Your attention is cut into pieces by emails, notifications and other people’s requests.",
          "The five rituals that follow protect important work before the day runs away with you.",
        ],
      },
      {
        title: "Ritual 1: the morning page",
        short: "Ritual 1",
        intro: "Before opening your emails, take ten minutes to write what really matters today.",
        paragraphs: [
          "Not a to-do list: one handwritten page to decide what would make the day a success.",
          "Julien, a freelance designer, used to work until 9 p.m. Two weeks after his first morning page, he was closing his laptop at 6 p.m.",
        ],
        checklist: ["Write before opening the laptop", "Three sentences at most", "Read the page again at noon"],
      },
      {
        title: "Ritual 2: the three priorities",
        short: "Ritual 2",
        intro: "Choose three tasks, not one more.",
        paragraphs: [
          "The rest can wait, and that is fine. Put your three priorities before noon, when your energy is highest.",
        ],
        box: { title: "Remember", text: "A priority that does not fit in one sentence is a project, not a task." },
      },
      {
        title: "Ritual 3: email in two passes",
        short: "Ritual 3",
        intro: "Open your inbox at 11 a.m. and 4 p.m. only.",
        paragraphs: ["In between, notifications stay off. Tell your clients your hours: they adapt quickly."],
        checklist: ["Notifications off", "Two slots in the calendar", "A template reply for urgent matters"],
      },
      {
        title: "Ritual 4: focus blocks",
        short: "Ritual 4",
        intro: "Two 50-minute blocks a day, with the phone in another room.",
        paragraphs: ["During a block, one task only: the one you chose in the morning."],
        box: { title: "Tip", text: "Jot down ideas that pop up during a block and deal with them afterwards." },
      },
      {
        title: "Ritual 5: the Friday review",
        short: "Ritual 5",
        intro: "Twenty minutes to close the week.",
        paragraphs: ["What worked, what got stuck, what is coming. You start Monday already knowing where to go."],
        checklist: ["Three wins", "One thing to change", "Monday’s priorities"],
      },
      {
        title: "Your 30-day plan",
        short: "30-day plan",
        intro: "Set up one ritual a week, not everything at once.",
        paragraphs: ["After a month, the five rituals take less than an hour a day."],
        checklist: [
          "Week 1: the morning page",
          "Week 2: the three priorities",
          "Week 3: email in two passes",
          "Week 4: blocks and review",
        ],
      },
    ],
  },
};

const PLACEHOLDER: Record<
  Locale,
  { part: string; intro: string; text: string; more: string; points: string[]; subtitle: string; untitled: string }
> = {
  fr: {
    part: "Partie",
    intro: "Cette partie sera rédigée à partir de votre idée, dans le ton que vous avez choisi.",
    text: "Le texte définitif remplacera ce paragraphe dès que la rédaction par IA sera branchée. La mise en page, elle, est déjà celle de votre ebook.",
    more: "Chaque partie suit le même rythme : une idée, un exemple concret, puis ce que le lecteur peut faire tout de suite.",
    points: ["Une idée clé", "Un exemple concret", "Une action à faire tout de suite"],
    subtitle: "Un ebook créé avec Nolio",
    untitled: "Ebook sans titre",
  },
  en: {
    part: "Part",
    intro: "This part will be written from your idea, in the tone you chose.",
    text: "The final text will replace this paragraph once AI writing is connected. The layout, however, is already that of your ebook.",
    more: "Each part follows the same rhythm: an idea, a concrete example, then what the reader can do right away.",
    points: ["One key idea", "A concrete example", "One thing to do right away"],
    subtitle: "An ebook made with Nolio",
    untitled: "Untitled ebook",
  },
};

/* Parts in the placeholder structure for each length */
const PLACEHOLDER_PARTS = { short: 5, medium: 9, long: 15 };

function titleFromIdea(idea: string, fallback: string) {
  const words = firstSentence(idea)
    .replace(/…$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : fallback;
}

export function buildEbook(draft: Draft, lang: Locale, brand?: BrandCta): EbookContent {
  const videos = draft.media.filter((item) => item.kind === "video");
  const links = draft.media.filter((item) => item.kind === "link");
  const files = draft.media.filter((item) => item.kind === "file");
  const [ctaLink, ...otherLinks] = links;
  const cta = ctaLink
    ? { label: ctaLink.title, url: ctaLink.url }
    : brand?.cta
      ? { label: brand.cta, url: brand.link }
      : null;
  const resources = [...otherLinks, ...files];
  const analysis = getAnalysis(draft, lang);
  const text = PLACEHOLDER[lang];

  // The outline written by the AI, while it matches the answers: real titles, intros and key points
  if (draft.outline && draft.outlineKey === outlineKey(draft, lang)) {
    const byId = new Map(videos.map((video) => [video.id, video]));
    return {
      title: draft.outline.title,
      subtitle: draft.outline.subtitle,
      kind: analysis.kind,
      sample: false,
      chapters: draft.outline.chapters.map((chapter) => ({
        title: chapter.title,
        short: chapter.short,
        intro: chapter.intro,
        paragraphs: [text.text],
        checklist: chapter.points.slice(0, 3),
        video: chapter.videoIds.map((id) => byId.get(id)).find(Boolean),
      })),
      cta,
      resources,
    };
  }

  if (isSampleIdea(draft.idea)) {
    const sample = SAMPLE[lang];
    return {
      title: sample.title,
      subtitle: sample.subtitle,
      kind: analysis.kind,
      sample: true,
      // One video per ritual, in the order they were added
      chapters: sample.chapters.map((chapter, index) => ({
        ...chapter,
        video: index >= 1 ? videos[index - 1] : undefined,
      })),
      cta,
      resources,
    };
  }

  return {
    title: analysis.title,
    subtitle: analysis.subtitle,
    kind: analysis.kind,
    sample: false,
    chapters: Array.from({ length: PLACEHOLDER_PARTS[draft.length] }, (_, index) => ({
      title: `${text.part} ${index + 1}`,
      short: `${text.part} ${index + 1}`,
      intro: text.intro,
      paragraphs: [text.text, text.more],
      checklist: text.points,
      video: videos[index],
    })),
    cta,
    resources,
  };
}

/* ---------- Pages ---------- */

export type PageModel =
  | { kind: "cover" }
  | { kind: "contents" }
  /* A chapter spread over two pages: its opener, then its body */
  | { kind: "opener"; chapter: number }
  | { kind: "body"; chapter: number }
  /* A short chapter on a single page */
  | { kind: "single"; chapter: number }
  | { kind: "closing" };

export type Pagination = {
  pages: PageModel[];
  /* Page number where each chapter starts, from 1 */
  chapterStarts: number[];
};

function needsTwoPages(chapter: Chapter, roomy: boolean) {
  if (roomy || chapter.video) return true;
  return Boolean(chapter.checklist?.length) && chapter.paragraphs.length > 1;
}

export function paginate(content: EbookContent, draft: Draft): Pagination {
  // Longer ebooks give every chapter its own opener
  const roomy = draft.length !== "short";
  const pages: PageModel[] = [{ kind: "cover" }, { kind: "contents" }];
  const chapterStarts: number[] = [];

  content.chapters.forEach((chapter, index) => {
    chapterStarts.push(pages.length + 1);
    if (needsTwoPages(chapter, roomy)) {
      pages.push({ kind: "opener", chapter: index }, { kind: "body", chapter: index });
    } else {
      pages.push({ kind: "single", chapter: index });
    }
  });

  pages.push({ kind: "closing" });
  return { pages, chapterStarts };
}
