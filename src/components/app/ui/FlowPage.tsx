import Link from "next/link";
import type { ReactNode } from "react";
import button from "./Button.module.css";
import styles from "./FlowPage.module.css";
import ui from "./ui.module.css";

type Action = { href: string; label: string };

type FlowPageProps = {
  kicker: string;
  question: string;
  lead?: ReactNode;
  wide?: boolean;
  back?: Action;
  /* A secondary way forward, between "Back" and the main action */
  skip?: Action;
  /* The main action: a link to the next page or a button */
  primary: ReactNode;
  children?: ReactNode;
};

export function FlowPage({ kicker, question, lead, wide, back, skip, primary, children }: FlowPageProps) {
  return (
    <div className={styles.flow}>
      <div className={wide ? `${styles.inner} ${styles.wide}` : styles.inner}>
        <p className={ui.kicker}>{kicker}</p>
        <h1 id="flow-question" className={styles.question}>
          {question}
        </h1>
        {lead && <p className={ui.lead}>{lead}</p>}
        {children && <div className={styles.body}>{children}</div>}
        <div className={styles.actions}>
          {back ? (
            <Link href={back.href} className={button.text}>
              {back.label}
            </Link>
          ) : (
            <span />
          )}
          {skip && (
            <Link href={skip.href} className={button.text}>
              {skip.label}
            </Link>
          )}
          {primary}
        </div>
      </div>
    </div>
  );
}

type NextActionProps = {
  href: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

/* The main action of a step: a link, or an inactive button until the step is answered */
export function NextAction({ href, label, disabled = false, onClick }: NextActionProps) {
  if (disabled) {
    return (
      <button type="button" className={button.primary} disabled>
        {label}
      </button>
    );
  }
  return (
    <Link href={href} className={button.primary} onClick={onClick}>
      {label}
    </Link>
  );
}
