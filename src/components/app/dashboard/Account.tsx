"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import { formatPrice } from "@/i18n/format";
import { PLAN_PRICES, PLANS, ROLES, type Plan, type RoleId } from "@/lib/app/account";
import { setPlan, updateProfile, usePlan, useProfile } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import { Tag } from "../ui/Tag";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./dashboard.module.css";

type Tab = "profile" | "plan" | "invoices";

function AccountTabs({ current }: { current: Tab }) {
  const { lang, t } = useAppText();
  const base = `/${lang}/app/account`;
  const tabs: { id: Tab; href: string }[] = [
    { id: "profile", href: base },
    { id: "plan", href: `${base}/plan` },
    { id: "invoices", href: `${base}/invoices` },
  ];
  return (
    <nav className={styles.tabs} aria-label={t.account.tabsLabel}>
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href} aria-current={tab.id === current ? "page" : undefined}>
          {t.account.tabs[tab.id]}
        </Link>
      ))}
    </nav>
  );
}

function Profile() {
  const { lang, t } = useAppText();
  const profile = useProfile();
  const a = t.account;
  const fields = [
    { key: "firstName", label: a.firstName, type: "text", autoComplete: "given-name" },
    { key: "lastName", label: a.lastName, type: "text", autoComplete: "family-name" },
    { key: "email", label: a.email, type: "email", autoComplete: "email" },
  ] as const;

  return (
    <>
      <div className={styles.profile}>
        {fields.map((item) => (
          <div key={item.key} className={field.field}>
            <label className={field.label} htmlFor={`profile-${item.key}`}>
              {item.label}
            </label>
            <input
              id={`profile-${item.key}`}
              className={field.input}
              type={item.type}
              autoComplete={item.autoComplete}
              value={profile[item.key]}
              onChange={(event) => updateProfile({ [item.key]: event.target.value })}
            />
          </div>
        ))}
        <div className={field.field}>
          <label className={field.label} htmlFor="profile-role">
            {a.role}
          </label>
          <select
            id="profile-role"
            className={field.select}
            value={profile.role ?? ""}
            onChange={(event) => updateProfile({ role: (event.target.value || null) as RoleId | null })}
          >
            <option value="">{a.roleNone}</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {t.welcome.roles[role].name}
              </option>
            ))}
          </select>
        </div>
        <div className={field.field}>
          <span className={field.label}>{a.language}</span>
          <LanguageSwitch lang={lang} label={a.language} names={a.languageNames} />
        </div>
      </div>
      <div className={styles.profileFooter}>
        <p className={ui.hint}>{a.saved}</p>
        {/* TODO: end the session once accounts are connected */}
        <Link href={`/${lang}`} className={button.text}>
          {a.logout}
        </Link>
      </div>
    </>
  );
}

function Plans() {
  const { lang, t } = useAppText();
  const plan = usePlan();
  const a = t.account;
  const rank = (value: Plan) => PLANS.indexOf(value);

  return (
    <>
      <div className={styles.plans}>
        {PLANS.map((offer) => (
          <section key={offer} className={offer === "pro" ? `${styles.plan} ${styles.planPro}` : styles.plan}>
            <div className={styles.planHead}>
              <h2 className={ui.h2}>{t.common.plans[offer]}</h2>
              {offer === plan ? (
                <Tag>{a.current}</Tag>
              ) : (
                offer === "pro" && <Tag variant="filled">{a.complete}</Tag>
              )}
            </div>
            <p className={styles.price}>
              <span className={styles.amount}>{formatPrice(lang, PLAN_PRICES[offer])}</span>
              {offer !== "free" && <span className={`${ui.small} ${ui.muted}`}>{t.common.perMonth}</span>}
            </p>
            <ul className={styles.perks}>
              {a.perks[offer].map((perk) => (
                <li key={perk}>
                  <span className={ui.check} aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
            {offer !== plan && (
              // TODO: go through checkout once payments are connected
              <button
                type="button"
                className={`${offer === "pro" ? button.primary : button.secondary} ${styles.planAction}`}
                onClick={() => setPlan(offer)}
              >
                {rank(offer) > rank(plan) ? a.choose(t.common.plans[offer]) : a.downgrade(t.common.plans[offer])}
              </button>
            )}
          </section>
        ))}
      </div>
      <p className={ui.hint}>{a.yearly}</p>
    </>
  );
}

export function Account() {
  const { t } = useAppText();
  const pathname = usePathname();
  const tab: Tab = pathname.endsWith("/plan") ? "plan" : pathname.endsWith("/invoices") ? "invoices" : "profile";

  return (
    <div className={styles.content}>
      <div>
        <p className={ui.kicker}>{t.account.kicker}</p>
        <h1 className={ui.h1}>{t.account.titles[tab]}</h1>
      </div>
      <AccountTabs current={tab} />
      {tab === "profile" && <Profile />}
      {tab === "plan" && <Plans />}
      {tab === "invoices" && <p className={ui.small}>{t.account.invoicesEmpty}</p>}
    </div>
  );
}
