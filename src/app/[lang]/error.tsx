"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import page from "@/components/pages/page.module.css";
import button from "@/components/shared/Button.module.css";
import styles from "./error.module.css";

/* Kept here rather than in the dictionaries so the error boundary stays light */
const COPY = {
  en: {
    kicker: "Error",
    title: "Something went wrong.",
    lead: "This page could not be displayed. Try again, or go back to the cover.",
    retry: "Try again",
    home: "Back to the cover",
  },
  fr: {
    kicker: "Erreur",
    title: "Un problème est survenu.",
    lead: "Cette page n’a pas pu s’afficher. Réessayez, ou revenez à la couverture.",
    retry: "Réessayer",
    home: "Retour à la couverture",
  },
};

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  const params = useParams<{ lang: string }>();
  const lang = params.lang === "fr" ? "fr" : "en";
  const t = COPY[lang];

  return (
    <main className={styles.stage}>
      <div className={styles.frame}>
        <div className={styles.card}>
          <div className={styles.body}>
            <p className={page.kicker}>{t.kicker}</p>
            <h1 className={page.title}>{t.title}</h1>
            <p className={page.lead}>{t.lead}</p>
            <div className={styles.actions}>
              <button type="button" className={button.primary} onClick={() => retry()}>
                {t.retry}
              </button>
              <Link href={`/${lang}`} className={button.secondary}>
                {t.home}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
