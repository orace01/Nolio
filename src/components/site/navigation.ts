/* The pages of the book, in reading order; labels come from the dictionary */
export const PAGE_IDS = ["home", "about", "formats", "process", "contact"] as const;

export type PageId = (typeof PAGE_IDS)[number];
