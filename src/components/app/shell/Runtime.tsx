"use client";

import { useEffect, useState, type ReactNode } from "react";
import { api, getRuntime, setRuntime, type Runtime } from "@/lib/app/api";
import type { Ebook } from "@/lib/app/model";
import { hasWorkInProgress, loadRemoteState, readEbooks, replaceEbooks, setDraftLang } from "@/lib/app/store";
import button from "../ui/Button.module.css";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";

/* What the server has configured, known before any screen renders */
export function RuntimeConfig({ runtime }: { runtime: Runtime }) {
  setRuntime(runtime);
  return null;
}

const POLL_MS = 3000;

/*
 * With accounts, the screens wait for the state saved on the server, then
 * follow the jobs that run on it (creation, fixes) until they finish.
 */
export function RemoteState({ children }: { children: ReactNode }) {
  const { lang, t } = useAppText();
  const remote = getRuntime().remote;
  const [status, setStatus] = useState<"loading" | "ready" | "error">(remote ? "loading" : "ready");
  const [attempt, setAttempt] = useState(0);
  setDraftLang(lang);

  useEffect(() => {
    if (!remote) return;
    let cancelled = false;
    loadRemoteState()
      .then(() => !cancelled && setStatus("ready"))
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [remote, attempt]);

  useEffect(() => {
    if (!remote || status !== "ready") return;
    const timer = setInterval(() => {
      if (!hasWorkInProgress(readEbooks())) return;
      void api<{ ebooks: Ebook[] }>("/api/ebooks")
        .then(({ ebooks }) => replaceEbooks(ebooks))
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [remote, status]);

  if (status === "ready") return children;
  if (status === "loading") return <div aria-busy="true" />;
  return (
    <div style={{ padding: 40 }}>
      <p className={ui.small}>{t.runtime.error}</p>
      <button
        type="button"
        className={button.secondary}
        style={{ marginTop: 16 }}
        onClick={() => {
          setStatus("loading");
          setAttempt((value) => value + 1);
        }}
      >
        {t.runtime.retry}
      </button>
    </div>
  );
}
