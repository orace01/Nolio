"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions";
import { INITIAL_WAITLIST_STATE } from "@/lib/waitlist";
import page from "./page.module.css";
import styles from "./WaitlistForm.module.css";

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    INITIAL_WAITLIST_STATE,
  );

  return (
    <form action={formAction} className={styles.form}>
      <label htmlFor="waitlist-email" className={page.label}>
        Email address
      </label>
      <div className={styles.row}>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={pending}>
          Join the waitlist
        </button>
      </div>
      <p className={`${page.small} ${styles.status}`} role="status">
        {state.message}
      </p>
    </form>
  );
}
