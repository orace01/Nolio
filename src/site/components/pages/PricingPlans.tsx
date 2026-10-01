import Link from "@/components/shared/Link";
import { useState, type ReactNode } from "react";
import button from "@/components/shared/Button.module.css";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { formatPrice } from "@/i18n/format";
import page from "./page.module.css";
import styles from "./PricingPage.module.css";

type Billing = "monthly" | "yearly";

const BILLINGS: Billing[] = ["monthly", "yearly"];
const FEATURED_PLAN = "starter";

type PricingPlansProps = {
  lang: Locale;
  t: Dictionary["pricing"];
  /* The page heading, shown left of the billing switch */
  children: ReactNode;
};

export function PricingPlans({ lang, t, children }: PricingPlansProps) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className={styles.layout}>
      <div className={styles.head}>
        <div>{children}</div>
        <div className={styles.side}>
          <div className={styles.billing} role="group" aria-label={t.billingLabel}>
            {BILLINGS.map((option) => (
              <button
                key={option}
                type="button"
                className={styles.billingOption}
                aria-pressed={billing === option}
                onClick={() => setBilling(option)}
              >
                {t[option]}
              </button>
            ))}
            <span className={styles.saving}>{t.yearlyNote}</span>
          </div>
          <p className={`${page.small} ${styles.note}`}>{t.note}</p>
        </div>
      </div>

      <ul className={styles.plans}>
        {t.plans.map((plan) => {
          const featured = plan.id === FEATURED_PLAN;
          const amount = billing === "monthly" ? plan.monthly : plan.yearly;

          return (
            <li
              key={plan.id}
              className={featured ? `${styles.plan} ${styles.featured}` : styles.plan}
            >
              {featured && <span className={styles.badge}>{t.recommended}</span>}
              <h3 className={page.label}>{plan.name}</h3>
              <p className={styles.price}>
                <span className={styles.amount}>{formatPrice(lang, amount)}</span>
                <span className={styles.period}>
                  {billing === "monthly" ? t.perMonth : t.perYear}
                </span>
              </p>
              <p className={`${page.small} ${styles.tagline}`}>{plan.tagline}</p>
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={page.small}>
                    <svg className={styles.check} viewBox="0 0 10 8" aria-hidden="true">
                      <polyline points="1,4.2 3.8,7 9,1" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${lang}/signup?plan=${plan.id}`}
                className={`${featured ? button.primary : button.secondary} ${styles.cta}`}
              >
                {plan.cta}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
