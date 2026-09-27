"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import button from "@/components/shared/Button.module.css";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { supabaseBrowser } from "@/lib/supabase/browser";
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
  mode: "login" | "signup" | "forgot" | "reset";
  lang: string;
  /* Accounts are connected (Supabase configured) */
  remote: boolean;
  fields: AuthField[];
  submit: string;
  /* Without accounts: shown after a valid submit when there is nowhere to go */
  notice: string;
  messages: Dictionary["account"]["messages"];
  /* Rendered between the fields and the button (consent, forgotten password) */
  extra?: ReactNode;
  /* Where a successful submit leads */
  redirectTo?: string;
};

/* A path of this site from ?next=, to come back where the login was asked */
function nextPath(fallback: string) {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function AuthForm({ mode, lang, remote, fields, submit, notice, messages, extra, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    setError("");
    setStatus("");

    // Demo: no accounts yet, the forms lead straight into the app
    if (!remote) {
      if (redirectTo) router.push(redirectTo);
      else setStatus(notice);
      return;
    }

    setPending(true);
    const supabase = supabaseBrowser();
    const callback = (next: string) => `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`;
    try {
      if (mode === "login") {
        const { error: failure } = await supabase.auth.signInWithPassword({
          email: value("email"),
          password: String(data.get("password") ?? ""),
        });
        if (failure) return setError(messages.invalid);
        router.replace(nextPath(redirectTo ?? `/${lang}/app`));
        router.refresh();
      } else if (mode === "signup") {
        const [firstName, ...rest] = value("name").split(/\s+/);
        const { data: result, error: failure } = await supabase.auth.signUp({
          email: value("email"),
          password: String(data.get("password") ?? ""),
          options: {
            data: { first_name: firstName ?? "", last_name: rest.join(" ") },
            emailRedirectTo: callback(`/${lang}/app/welcome`),
          },
        });
        if (failure) {
          const code = failure.code ?? "";
          return setError(
            code === "user_already_exists" || code === "email_exists"
              ? messages.exists
              : code === "weak_password"
                ? messages.weak
                : messages.generic,
          );
        }
        // With email confirmation on, the session starts from the email's link
        if (result.session) {
          router.replace(redirectTo ?? `/${lang}/app/welcome`);
          router.refresh();
        } else {
          setStatus(messages.confirm);
        }
      } else if (mode === "forgot") {
        await supabase.auth.resetPasswordForEmail(value("email"), {
          redirectTo: callback(`/${lang}/reset-password`),
        });
        setStatus(messages.sent);
      } else {
        const { error: failure } = await supabase.auth.updateUser({ password: String(data.get("password") ?? "") });
        if (failure) return setError(failure.code === "weak_password" ? messages.weak : messages.generic);
        router.replace(`/${lang}/app`);
        router.refresh();
      }
    } catch {
      setError(messages.generic);
    } finally {
      setPending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => void onSubmit(event)}>
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

      <button type="submit" className={`${button.primary} ${styles.submit}`} disabled={pending}>
        {submit}
      </button>
      <p className={styles.status} role={error ? "alert" : "status"}>
        {error || status}
      </p>
    </form>
  );
}
