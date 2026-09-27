"use client";

import type { ReactNode } from "react";
import type { Tier } from "@/lib/app/catalog";
import { useAppText } from "../useAppText";
import styles from "./Tag.module.css";

type TagProps = {
  variant?: "outline" | "filled" | "quiet";
  children: ReactNode;
  className?: string;
};

export function Tag({ variant = "outline", children, className }: TagProps) {
  const variantClass = variant === "outline" ? "" : ` ${styles[variant]}`;
  return <span className={`${styles.tag}${variantClass}${className ? ` ${className}` : ""}`}>{children}</span>;
}

/* Basique is included, Premium is outlined, Pro is filled */
export function TierTag({ tier }: { tier: Tier }) {
  const { t } = useAppText();
  const variant = tier === "basic" ? "quiet" : tier === "premium" ? "outline" : "filled";
  return <Tag variant={variant}>{t.common.tiers[tier]}</Tag>;
}
