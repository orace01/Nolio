"use client";

import type { ReactNode } from "react";
import type { Tier } from "@/lib/app/catalog";
import styles from "./Option.module.css";
import { TierTag } from "./Tag";

type OptionProps = {
  type?: "radio" | "checkbox";
  name: string;
  checked: boolean;
  /* Locked options are buttons that open the plan dialog instead */
  locked?: boolean;
  onSelect: () => void;
  title: ReactNode;
  tier?: Tier;
  description?: ReactNode;
  preview?: ReactNode;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Option({
  type = "radio",
  name,
  checked,
  locked = false,
  onSelect,
  title,
  tier,
  description,
  preview,
  compact = false,
  className,
  children,
}: OptionProps) {
  const classes = [
    styles.option,
    compact && styles.compact,
    checked && styles.selected,
    locked && styles.locked,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {preview && <span className={styles.preview}>{preview}</span>}
      <span className={styles.title}>
        {title}
        {tier && <TierTag tier={tier} />}
      </span>
      {description && <span className={styles.desc}>{description}</span>}
      {children}
    </>
  );

  if (locked) {
    return (
      <button type="button" className={classes} onClick={onSelect}>
        {content}
      </button>
    );
  }

  return (
    <label className={classes}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onSelect}
        className={styles.input}
      />
      {content}
    </label>
  );
}

type OptionGridProps = {
  columns?: 2 | 3;
  /* The group is named by the page question unless told otherwise */
  labelledBy?: string;
  children: ReactNode;
};

export function OptionGrid({ columns = 2, labelledBy = "flow-question", children }: OptionGridProps) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={columns === 3 ? `${styles.grid} ${styles.three}` : styles.grid}
    >
      {children}
    </div>
  );
}
