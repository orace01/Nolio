/* The pages of the book, in reading order; labels come from the dictionary */
export const PAGE_IDS = ["home", "about", "formats", "process", "pricing", "start"] as const;

export type PageId = (typeof PAGE_IDS)[number];

/* Pages listed in the menu; the back cover ("start") closes the book */
export const NAV_IDS = ["home", "about", "formats", "process", "pricing"] as const;
