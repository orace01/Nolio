"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import leaves from "@/assets/hero/hero-leaves.jpg";
import type { PremiumKind } from "@/i18n/app/en";
import { formatPrice } from "@/i18n/format";
import { PLAN_PRICES, type Plan } from "@/lib/app/account";
import { resolveLook, type StyleId, type ThemeChoice, type Tier } from "@/lib/app/catalog";
import { buildEbook } from "@/lib/app/content";
import { setPlan, useDraft, usePlan } from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import { useAppText } from "../useAppText";
import button from "./Button.module.css";
import styles from "./Premium.module.css";
import ui from "./ui.module.css";

export type UpgradeRequest = {
  /* What was clicked, as shown to the user: "Studio", "Medium", "EPUB" */
  name: string;
  kind: PremiumKind;
  tier: Exclude<Tier, "basic">;
  /* The cover shown beside the offer, the current one by default */
  preview?: { style?: StyleId; theme?: ThemeChoice };
  /* Applies the choice once the plan allows it */
  onUnlock?: () => void;
};

const UpgradeContext = createContext<(request: UpgradeRequest) => void>(() => {});

/* Any page asks for the plan dialog with useUpgrade()(request) */
export function useUpgrade() {
  return useContext(UpgradeContext);
}

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<UpgradeRequest | null>(null);

  return (
    <UpgradeContext value={setRequest}>
      {children}
      {request && <PremiumDialog request={request} onClose={() => setRequest(null)} />}
    </UpgradeContext>
  );
}

function PremiumDialog({ request, onClose }: { request: UpgradeRequest; onClose: () => void }) {
  const { lang, t } = useAppText();
  const ref = useRef<HTMLDialogElement>(null);
  const plan = usePlan();
  const draft = useDraft();

  // Unmounting removes the dialog; closing it here as well would send a late
  // "close" event that shuts the next one
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const tierName = t.common.tiers[request.tier];
  const offers: Plan[] = request.tier === "pro" ? ["pro"] : ["starter", "pro"];
  const style = request.preview?.style ?? draft.style;
  const look = resolveLook(request.preview?.theme ?? draft.theme, draft.customTheme);
  const { title } = buildEbook(draft, lang);

  // TODO: open the checkout instead of switching the plan directly
  const choose = (next: Plan) => {
    setPlan(next);
    request.onUnlock?.();
    onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="premium-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog itself
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.visual}>
        <Image src={leaves} alt="" fill sizes="330px" style={{ objectFit: "cover", objectPosition: "60% 40%" }} />
        <Cover style={style} look={look} title={title} className={styles.visualCover} />
      </div>

      <div className={styles.body}>
        <button type="button" className={`${button.text} ${styles.close}`} onClick={onClose}>
          {t.premium.close}
        </button>
        <p className={ui.kicker}>{t.premium.kicker(tierName)}</p>
        {/* Focus starts on the title, so screen readers announce the offer first */}
        <h2 id="premium-title" className={styles.title} tabIndex={-1} autoFocus>
          {t.premium.title(request.name, request.kind, tierName)}
        </h2>
        <p className={ui.small}>{t.premium.text[request.tier]}</p>

        <div className={styles.plans}>
          {offers.map((offer) => (
            <div key={offer} className={styles.plan}>
              <span className={ui.label}>{t.common.plans[offer]}</span>
              <p className={styles.price}>
                <span className={styles.amount}>{formatPrice(lang, PLAN_PRICES[offer])}</span>
                <span className={`${ui.small} ${ui.muted}`}>{t.common.perMonth}</span>
              </p>
              <ul className={styles.perks}>
                {t.premium.perks[offer === "starter" ? "starter" : "pro"].map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {offers.map((offer, index) => (
            <button
              key={offer}
              type="button"
              className={index === 0 ? button.primary : button.secondary}
              onClick={() => choose(offer)}
            >
              {t.premium.choose(t.common.plans[offer])}
            </button>
          ))}
          <button type="button" className={button.text} onClick={onClose}>
            {t.premium.stay(t.common.plans[plan])}
          </button>
        </div>
      </div>
    </dialog>
  );
}
