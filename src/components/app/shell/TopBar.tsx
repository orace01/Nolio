"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initials } from "@/lib/app/account";
import { updateDraft, usePlan, useProfile } from "@/lib/app/store";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./TopBar.module.css";

function Logo() {
  const { lang, t } = useAppText();
  return (
    <Link href={`/${lang}/app`} className={styles.logo} aria-label={t.topBar.home}>
      Nolio.
    </Link>
  );
}

function Avatar() {
  const { lang, t } = useAppText();
  const profile = useProfile();
  return (
    <Link href={`/${lang}/app/account`} className={styles.avatar} aria-label={t.topBar.yourAccount}>
      {initials(profile.firstName, profile.lastName)}
    </Link>
  );
}

function Quota() {
  const { t } = useAppText();
  const plan = usePlan();
  return <span className={styles.quota}>{t.common.planLabels[plan]}</span>;
}

/* Welcome screen and overview: the brand and the account only */
export function PlainTopBar() {
  return (
    <header className={styles.bar}>
      <Logo />
      <div className={styles.user}>
        <Quota />
        <Avatar />
      </div>
    </header>
  );
}

/* Library, brand kit and account */
export function DashboardTopBar() {
  const { lang, t } = useAppText();
  const pathname = usePathname();
  const base = `/${lang}/app`;
  const links = [
    { href: base, label: t.topBar.library, current: pathname === base },
    { href: `${base}/brand`, label: t.topBar.brand, current: pathname.startsWith(`${base}/brand`) },
    { href: `${base}/account`, label: t.topBar.account, current: pathname.startsWith(`${base}/account`) },
  ];

  return (
    <header className={styles.bar}>
      <Logo />
      <nav className={styles.menu} aria-label={t.topBar.menu}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={link.current ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className={styles.user}>
        <Quota />
        <Avatar />
      </div>
    </header>
  );
}

/* Which of the five steps a creation page belongs to */
const PHASES: [RegExp, number][] = [
  [/\/new\/(idea|analysis)$/, 1],
  [/\/new\/(audience|media|length|summary)$/, 2],
  [/\/new\/(style|style\/studio|colors|writing|illustrations|images)$/, 3],
  [/\/(new\/validation|ebooks\/[^/]+\/creating)$/, 4],
  [/\/ebooks\/[^/]+(\/download)?$/, 5],
];

export function phaseOf(pathname: string) {
  return PHASES.find(([pattern]) => pattern.test(pathname))?.[1] ?? 0;
}

/* The creation steps, with "Save and quit" */
export function CreationTopBar() {
  const { lang, t } = useAppText();
  const pathname = usePathname();
  const phase = phaseOf(pathname);

  // The overview comes before the steps start
  if (phase === 0) return <PlainTopBar />;

  return (
    <header className={styles.bar}>
      <Logo />
      <ol className={styles.stepper} aria-label={t.topBar.stepsLabel}>
        {t.topBar.steps.map((name, index) => {
          const step = index + 1;
          const state = step < phase ? styles.done : step === phase ? styles.current : "";
          return (
            <li key={name} className={`${styles.step} ${state}`} aria-current={step === phase ? "step" : undefined}>
              <span className={styles.n}>{step}</span>
              <span className={styles.name}>{name}</span>
              {step < phase && <span className={ui.srOnly}>, {t.topBar.stepDone}</span>}
            </li>
          );
        })}
      </ol>
      <div className={styles.user}>
        <Link href={`/${lang}/app`} className={styles.save}>
          {t.topBar.save}
        </Link>
        <Avatar />
      </div>
    </header>
  );
}

/* Remembers the last creation step visited, where "Resume" leads */
export function DraftStepTracker() {
  const pathname = usePathname();
  const step = pathname.match(/\/app\/new\/([a-z]+(?:\/studio)?)$/)?.[1];

  useEffect(() => {
    if (step) updateDraft({ lastStep: step });
  }, [step]);

  return null;
}
