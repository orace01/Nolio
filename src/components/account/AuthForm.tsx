"use client";

import { useState, type ReactNode } from "react";
import button from "@/components/shared/Button.module.css";
import styles from "./AuthForm.module.css";

export type AuthField = {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  placeholder?: string;
  hint?: string;
  minLength?: number;
};

type AuthFormProps = {
  fields: AuthField[];
  submit: string;
  /* Shown after a valid submit, since accounts are not connected yet */
  notice: string;
  /* Rendered between the fields and the button (consent, forgotten password) */
  extra?: ReactNode;
};

export function AuthForm({ fields, submit, notice, extra }: AuthFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {fields.map((field) => {
        const id = `account-${field.name}`;
        return (
          <div key={field.name} className={styles.field}>
            <label htmlFor={id} className={styles.label}>
              {field.label}
            </label>
            <input
              id={id}
              name={field.name}
              type={field.type}
              required
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              minLength={field.minLength}
              aria-describedby={field.hint ? `${id}-hint` : undefined}
              className={styles.input}
            />
            {field.hint && (
              <p id={`${id}-hint`} className={styles.hint}>
                {field.hint}
              </p>
            )}
          </div>
        );
      })}

      {extra}

      <button type="submit" className={`${button.primary} ${styles.submit}`}>
        {submit}
      </button>
      <p className={styles.status} role="status">
        {submitted ? notice : ""}
      </p>
    </form>
  );
}
