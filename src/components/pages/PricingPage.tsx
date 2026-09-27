import { ArrowLink } from "@/components/shared/ArrowLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import page from "./page.module.css";
import { PricingPlans } from "./PricingPlans";

export function PricingPage({ lang, t }: { lang: Locale; t: Dictionary["pricing"] }) {
  return (
    <>
      <PricingPlans lang={lang} t={t}>
        <p className={page.kicker}>{t.kicker}</p>
        <h2 className={page.title}>{t.title}</h2>
        <p className={page.lead}>{t.lead}</p>
      </PricingPlans>

      <ArrowLink href="#start" className={page.next}>
        {t.next}
      </ArrowLink>
    </>
  );
}
