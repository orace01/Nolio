"use client";

import { useParams } from "next/navigation";
import { isEbookReady } from "@/lib/app/model";
import { useEbook, useHydrated, useNow } from "@/lib/app/store";

/* The ebook named in the URL, and whether its simulated creation is over */
export function useEbookRoute() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const ebook = useEbook(id);
  const now = useNow();
  const ready = ebook !== undefined && isEbookReady(ebook, now);
  return { id, hydrated, ebook, now, ready };
}
