"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { canUse } from "@/lib/app/account";
import { api, getRuntime } from "@/lib/app/api";
import { FONT_NAMES, resolveLook, type CustomTheme } from "@/lib/app/catalog";
import { buildEbook } from "@/lib/app/content";
import type { ChatMessage, DesignProposal, DesignTurn } from "@/lib/app/model";
import { updateDraft, useBrand, useDraft, usePlan, useProfile } from "@/lib/app/store";
import { Cover } from "../ebook/Cover";
import button from "../ui/Button.module.css";
import field from "../ui/Field.module.css";
import { FlowPage, NextAction } from "../ui/FlowPage";
import { useUpgrade } from "../ui/Premium";
import ui from "../ui/ui.module.css";
import { useAppText } from "../useAppText";
import styles from "./steps.module.css";

/* ---------- The demo's stand-in for Gemini ---------- */

const PALETTES: { match: RegExp; accent: string; soft: string; paper: string }[] = [
  { match: /chaud|warm|terre|earth|orange|terracotta/i, accent: "#a4553a", soft: "#f0d9cc", paper: "#f7f2ec" },
  { match: /calme|calm|doux|soft|zen|nature|vert|green/i, accent: "#4f6b58", soft: "#d9e3dc", paper: "#f5f6f2" },
  { match: /luxe|luxury|élégant|elegant|noir|black|or|gold/i, accent: "#1d1d1d", soft: "#e4d8b8", paper: "#f7f4ec" },
  { match: /bleu|blue|confiance|trust|pro/i, accent: "#243a5e", soft: "#c9d3e3", paper: "#f4f5f7" },
  { match: /./, accent: "#2a3f34", soft: "#d8cfc0", paper: "#f4f3ef" },
];

function localTurn(messages: ChatMessage[], lang: "fr" | "en", brandColors: string[]): DesignTurn {
  const said = messages.filter((message) => message.role === "user").map((message) => message.text).join(" ");
  const fr = lang === "fr";
  if (messages.filter((message) => message.role === "user").length < 2) {
    return {
      reply: fr
        ? "Merci ! Pour viser juste : vos lecteurs doivent plutôt ressentir du calme, de l’énergie ou du sérieux ? Et avez-vous des couleurs de marque à respecter ?"
        : "Thank you! To get it right: should your readers feel calm, energy or seriousness? And do you have brand colors to keep?",
      proposals: [],
    };
  }
  const palette = PALETTES.find((entry) => entry.match.test(said))!;
  const accent = brandColors[0] ?? palette.accent;
  return {
    reply: fr
      ? "Voici trois pistes. Choisissez celle qui vous parle, je peux ensuite l’ajuster."
      : "Here are three directions. Pick the one you like, and I can adjust it.",
    proposals: [
      {
        name: fr ? "Épuré" : "Clean",
        description: fr ? "Une grille stricte, beaucoup de blanc, des titres affirmés." : "A strict grid, lots of white space, assertive titles.",
        base: "monograph",
        accent,
        soft: palette.soft,
        paper: palette.paper,
        titleFont: "montserrat",
        bodyFont: "sourceSerif",
        titleUppercase: true,
        margins: "wide",
        illustrations: "icons",
      },
      {
        name: fr ? "Magazine" : "Magazine",
        description: fr ? "Un serif élégant et des lettrines, pour une lecture posée." : "An elegant serif and drop caps, for an unhurried read.",
        base: "editorial",
        accent,
        soft: palette.soft,
        paper: "#f7f3ec",
        titleFont: "playfair",
        bodyFont: "lato",
        titleUppercase: false,
        margins: "normal",
        illustrations: "line",
      },
      {
        name: fr ? "Énergie" : "Energy",
        description: fr ? "Des aplats de couleur et de grands chiffres, pour passer à l’action." : "Color blocks and giant numbers, to get readers moving.",
        base: "studio",
        accent,
        soft: palette.soft,
        paper: palette.paper,
        titleFont: "dmSans",
        bodyFont: "inter",
        titleUppercase: true,
        margins: "narrow",
        illustrations: "shapes",
      },
    ],
  };
}

/* ---------- The studio ---------- */

function themeOf(proposal: DesignProposal): CustomTheme {
  return {
    accent: proposal.accent,
    soft: proposal.soft,
    paper: proposal.paper,
    titleFont: proposal.titleFont,
    bodyFont: proposal.bodyFont,
    titleUppercase: proposal.titleUppercase,
  };
}

export function StudioStep() {
  const { lang, t } = useAppText();
  const draft = useDraft();
  const plan = usePlan();
  const brand = useBrand();
  const profile = useProfile();
  const upgrade = useUpgrade();
  const s = t.studio;
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [failed, setFailed] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const title = useMemo(() => buildEbook(draft, lang).title, [draft, lang]);
  const allowed = canUse("pro", plan);
  const messages = draft.designChat;

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [messages.length, thinking]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || thinking) return;
    if (!allowed) {
      upgrade({ name: t.style.ownAction, kind: "option", tier: "pro" });
      return;
    }
    const next: ChatMessage[] = [...messages, { role: "user", text: value }];
    updateDraft({ designChat: next });
    setText("");
    setThinking(true);
    setFailed(false);
    try {
      const turn = getRuntime().ai.gemini
        ? await api<DesignTurn>("/api/ai/design", {
            body: {
              draft,
              lang,
              messages: next.slice(-30),
              brandColors: brand.colors,
              author: { name: `${profile.firstName} ${profile.lastName}`.trim(), role: null },
              brand: { bio: brand.bio, cta: brand.cta, link: brand.link },
            },
          })
        : await new Promise<DesignTurn>((resolve) =>
            setTimeout(() => resolve(localTurn(next, lang, brand.colors)), 1200),
          );
      updateDraft((current) => ({
        designChat: [...current.designChat, { role: "assistant", text: turn.reply }],
        designProposals: turn.proposals.length ? turn.proposals : current.designProposals,
      }));
    } catch {
      setFailed(true);
    } finally {
      setThinking(false);
    }
  };

  const apply = (proposal: DesignProposal) =>
    updateDraft({
      ownStyle: true,
      style: proposal.base,
      margins: proposal.margins,
      theme: "custom",
      customTheme: themeOf(proposal),
      illustrations: proposal.illustrations,
    });

  const chosen = (proposal: DesignProposal) =>
    draft.ownStyle &&
    draft.theme === "custom" &&
    draft.style === proposal.base &&
    draft.customTheme.accent === proposal.accent &&
    draft.customTheme.titleFont === proposal.titleFont;

  return (
    <FlowPage
      wide
      kicker={s.kicker}
      question={s.question}
      lead={s.lead}
      back={{ href: `/${lang}/app/new/style`, label: t.common.back }}
      primary={
        <NextAction href={`/${lang}/app/new/colors`} label={s.continue} disabled={!draft.ownStyle} />
      }
    >
      <div className={styles.studio}>
        <section className={styles.chat} aria-labelledby="studio-chat">
          <h2 id="studio-chat" className={ui.label}>
            {s.chat}
          </h2>
          <ol ref={list} className={styles.messages} aria-live="polite">
            <li className={`${styles.message} ${styles.fromAssistant}`}>{s.greeting}</li>
            {messages.map((message, index) => (
              <li
                key={index}
                className={`${styles.message} ${message.role === "user" ? styles.fromUser : styles.fromAssistant}`}
              >
                {message.text}
              </li>
            ))}
            {thinking && <li className={`${styles.message} ${styles.fromAssistant}`}>{s.thinking}</li>}
          </ol>
          <form className={styles.composer} onSubmit={send}>
            <textarea
              className={field.textarea}
              aria-label={s.inputLabel}
              placeholder={s.placeholder}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button type="submit" className={button.primary} disabled={!text.trim() || thinking}>
              {s.send}
            </button>
          </form>
          {failed && (
            <p className={field.error} role="alert">
              {s.failed}
            </p>
          )}
        </section>

        <section className={styles.proposals} aria-labelledby="studio-proposals">
          <h2 id="studio-proposals" className={ui.label}>
            {s.proposals}
          </h2>
          {draft.designProposals.length === 0 ? (
            <p className={`${ui.small} ${ui.muted} ${styles.emptyProposals}`}>{s.empty}</p>
          ) : (
            draft.designProposals.map((proposal, index) => {
              const look = resolveLook("custom", themeOf(proposal));
              const isChosen = chosen(proposal);
              return (
                <article
                  key={`${proposal.name}-${index}`}
                  className={isChosen ? `${styles.proposal} ${styles.proposalChosen}` : styles.proposal}
                >
                  <Cover style={proposal.base} look={look} title={title} className={styles.proposalCover} />
                  <div className={styles.proposalBody}>
                    <p className={styles.proposalName}>{proposal.name}</p>
                    <p className={ui.small}>{proposal.description}</p>
                    <span className={styles.proposalSwatches} aria-hidden="true">
                      {[proposal.accent, proposal.soft, proposal.paper].map((color) => (
                        <span key={color} style={{ background: color }} />
                      ))}
                    </span>
                    <p className={ui.hint}>
                      {FONT_NAMES[proposal.titleFont]} · {FONT_NAMES[proposal.bodyFont]}
                    </p>
                    <div>
                      <button
                        type="button"
                        className={`${isChosen ? button.primary : button.secondary} ${button.small}`}
                        aria-pressed={isChosen}
                        onClick={() => apply(proposal)}
                      >
                        {isChosen ? s.chosen : s.use}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </FlowPage>
  );
}
