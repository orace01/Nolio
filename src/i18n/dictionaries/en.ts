export const en = {
  meta: {
    title: "Nolio",
    description:
      "Nolio turns your expertise into ebooks that look and read like real books: a clear outline, your own voice and a designed layout.",
  },
  nav: {
    home: "Home",
    about: "About",
    formats: "Formats",
    process: "Process",
    contact: "Contact",
  },
  book: {
    previous: "Previous page",
    next: "Next page",
    language: "Language",
    languageNames: { en: "English", fr: "Français" },
  },
  hero: {
    follow: "Follow",
    slideLabel: "Cover",
    menu: "Open menu",
    kicker: "Your expertise, bound into",
    title: "A real book.",
    lead: "Nolio turns what you know into an ebook with a clear outline, your own voice and a designed layout. Choose a niche, a length and an art direction, then export a book you will be proud to share.",
    cta: "Open the book",
  },
  about: {
    kicker: "About Nolio",
    title: "Ebooks that read like real books.",
    lead: "Most AI ebooks look alike: thin chapters, generic advice, a template filled at random. Nolio works like an editor. It starts from your knowledge, builds the outline with you and gives every page a real layout.",
    principles: [
      {
        title: "Your voice",
        text: "Built from your notes, your method and your readers, never from generic filler.",
      },
      {
        title: "A real outline",
        text: "Every chapter follows a plan you approve before a single page is written.",
      },
      {
        title: "Designed pages",
        text: "Typography, grids and art direction made by designers, applied to every spread.",
      },
    ],
    next: "Next page",
  },
  formats: {
    kicker: "Formats and styles",
    title: "Your book, your style.",
    lead: "Every Nolio ebook starts from a format and an art direction. Together they set the length, the rhythm and the look of every page.",
    caption: "Three formats",
    rows: [
      { name: "Lead magnet", length: "15 to 30 pages", files: "PDF" },
      { name: "Guide", length: "40 to 80 pages", files: "PDF and EPUB" },
      { name: "Course companion", length: "60 to 120 pages", files: "PDF and EPUB" },
    ],
    stylesLabel: "Art directions",
    styles: {
      botanica: {
        name: "Botanica",
        description: "Photographic and calm, with generous white space.",
        coverTitle: "Grow a calmer practice",
        coverByline: "Coaching guide",
      },
      monograph: {
        name: "Monograph",
        description: "Pure typography on a strict grid.",
        coverTitle: "The focus method",
        coverByline: "Guide, 40 pages",
      },
      studio: {
        name: "Studio",
        description: "Bold blocks of color and oversized numbers.",
        coverTitle: "Launch in 30 days",
      },
      notes: {
        name: "Field notes",
        description: "Light, annotated pages made for workbooks.",
        coverTitle: "Notes on deep work",
      },
    },
    next: "Next page",
  },
  process: {
    kicker: "Process",
    title: "From brief to finished book, in five steps.",
    lead: "You stay the author from the first brief to the last page. Nolio does the heavy lifting in between, and nothing moves forward without your approval.",
    steps: [
      {
        title: "Describe",
        text: "Share your subject, your readers and what the book should achieve.",
      },
      {
        title: "Direct",
        text: "Set the tone, the target length and the art direction.",
      },
      {
        title: "Validate",
        text: "Review the outline. Move, rename or cut chapters before writing starts.",
      },
      {
        title: "Refine",
        text: "Generate each chapter, then edit the text and the layout page by page.",
      },
      {
        title: "Export",
        text: "Download a print-ready PDF or an EPUB for e‑readers.",
      },
    ],
    next: "Join the waitlist",
  },
  contact: {
    kicker: "Contact",
    title: "Join the waitlist.",
    lead: "Nolio is opening to a first group of authors. Leave your email and we will write to you as soon as your seat is ready.",
    form: {
      label: "Email address",
      placeholder: "you@example.com",
      submit: "Join the waitlist",
      success: "Thank you. We will write to you as soon as your seat is ready.",
      error: "Please enter a valid email address.",
    },
    follow: "Follow Nolio",
    legal: "© 2026 Nolio. All rights reserved.",
    back: "Back to cover",
  },
};

export type Dictionary = typeof en;
