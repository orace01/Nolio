"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { INITIAL_WAITLIST_STATE } from "@/lib/waitlist";
import page from "./page.module.css";
import styles from "./WaitlistForm.module.css";

export function WaitlistForm({ t }: { t: Dictionary["contact"]["form"] }) {
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    INITIAL_WAITLIST_STATE,
  );
  const message =
    state.status === "success" ? t.success : state.status === "error" ? t.error : "";

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor="waitlist-email" className={page.label}>
        {t.label}
      </label>
      <div className={styles.row}>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.placeholder}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={pending}>
          {t.submit}
        </button>
      </div>
      <p className={`${page.small} ${styles.status}`} role="status">
        {message}
      </p>
    </form>
  );
}
