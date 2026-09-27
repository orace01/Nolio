"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { PAGE_IDS } from "@/components/site/navigation";
import { SiteNav } from "@/components/site/SiteNav";
import { TopBar } from "@/components/site/TopBar";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Book.module.css";

export type BookPage = {
  id: string;
  title: string;
  content: ReactNode;
  /** The cover (the hero) draws its own header and page dots. */
  cover?: boolean;
  /** Color of the chrome on the left of the page: dark on grey, light on a photo. */
  leftTone?: "dark" | "light";
};

/*
 * The book is a tall scroll track with a sticky viewport. Each page owns one
 * step of vertical scroll; the scroll position becomes --p, the number of
 * pages turned so far, and every page derives its own turn from it in CSS.
 * Scrolling drives the turn directly, so a page moves exactly as far as the
 * wheel, the trackpad or the finger goes.
 */
type BookProps = {
  pages: BookPage[];
  lang: Locale;
  nav: Dictionary["nav"];
  ui: Dictionary["book"];
  top: Dictionary["top"];
};

export function Book({ pages, lang, nav, ui, top }: BookProps) {
  const bookRef = useRef<HTMLElement>(null);
  const secondAnchorRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<{ target: number; at: number } | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const book = bookRef.current;
    const second = secondAnchorRef.current;
    if (!book || !second) return;

    let frame = 0;
    let shown = 0;

    const update = () => {
      frame = 0;
      const turned = -book.getBoundingClientRect().top / stepHeight(book, second);
      const progress = Math.min(Math.max(turned, 0), pages.length - 1);
      book.style.setProperty("--p", progress.toFixed(4));

      const page = Math.round(progress);
      if (page !== shown) {
        shown = page;
        setCurrent(page);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pages.length]);

  /* Turns one page with the same animation as scrolling. Clicks made while a
     turn is still running chain from the page it is heading to. */
  const turn = (direction: 1 | -1) => {
    const book = bookRef.current;
    const second = secondAnchorRef.current;
    if (!book || !second) return;

    const step = stepHeight(book, second);
    const bookTop = book.getBoundingClientRect().top + window.scrollY;
    const progress = (window.scrollY - bookTop) / step;
    const pending = pendingRef.current;
    const chaining =
      pending !== null &&
      performance.now() - pending.at < 1000 &&
      Math.abs(progress - pending.target) > 0.01;
    const from = chaining
      ? pending.target
      : direction > 0
        ? Math.floor(progress + 0.001)
        : Math.ceil(progress - 0.001);
    const target = Math.min(Math.max(from + direction, 0), pages.length - 1);

    pendingRef.current = { target, at: performance.now() };
    window.scrollTo({ top: bookTop + target * step });
  };

  return (
    <section
      ref={bookRef}
      className={styles.book}
      style={{ "--count": pages.length } as CSSProperties}
    >
      {pages.map((page, index) => (
        <div
          key={page.id}
          id={page.id}
          ref={index === 1 ? secondAnchorRef : undefined}
          className={styles.anchor}
          style={{ "--k": index } as CSSProperties}
        />
      ))}

      <div className={styles.viewport}>
        <div className={styles.frame}>
          <div className={styles.pages}>
            <div className={styles.base} />
            {pages.map((page, index) => (
              <article
                key={page.id}
                className={
                  page.leftTone === "light"
                    ? `${styles.page} ${styles.leftLight}`
                    : styles.page
                }
                style={{ "--i": index, zIndex: pages.length - index } as CSSProperties}
                aria-label={page.title}
                inert={index !== current}
              >
                <div className={styles.content}>{page.content}</div>
                {!page.cover && <PageChrome page={page} index={index} nav={nav} />}
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.previous}`}
          aria-label={ui.previous}
          disabled={current === 0}
          onClick={() => turn(-1)}
        >
          <ArrowIcon />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label={ui.next}
          disabled={current === pages.length - 1}
          onClick={() => turn(1)}
        >
          <ArrowIcon />
        </button>

        <TopBar lang={lang} t={top} className={styles.topBar} />
      </div>
    </section>
  );
}

/* Hairline arrow, as "Learn more" in the hero; mirrored in CSS for "previous" */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 56 12" aria-hidden="true">
      <line x1="0" y1="6" x2="54.5" y2="6" />
      <polyline points="48,1 54.8,6 48,11" />
    </svg>
  );
}

/* Scroll distance for one page: where the second page's anchor sits */
function stepHeight(book: HTMLElement, secondAnchor: HTMLElement) {
  return secondAnchor.getBoundingClientRect().top - book.getBoundingClientRect().top;
}

/* Running head and page dots, the same on every page after the cover */
type PageChromeProps = {
  page: BookPage;
  index: number;
  nav: Dictionary["nav"];
};

function PageChrome({ page, index, nav }: PageChromeProps) {
  return (
    <>
      <a href="#home" className={styles.brand}>
        Nolio.
      </a>
      <SiteNav labels={nav} current={page.id} />
      <span className={styles.folio} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={styles.dots} aria-hidden="true">
        {PAGE_IDS.map((id, dot) => (
          <span
            key={id}
            className={
              dot === index ? `${styles.dot} ${styles.dotCurrent}` : styles.dot
            }
          />
        ))}
      </span>
    </>
  );
}
