import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/* Uppercase label followed by a long hairline arrow, as "Learn more" in the hero */
export function ArrowLink({ href, children, className }: ArrowLinkProps) {
  return (
    <Link href={href} className={className ? `${styles.link} ${className}` : styles.link}>
      {children}
      <svg className={styles.arrow} viewBox="0 0 50 6" aria-hidden="true">
        <line x1="0" y1="3" x2="49" y2="3" />
        <polyline points="45.5,0.4 49.2,3 45.5,5.6" />
      </svg>
    </Link>
  );
}
