import Image from "next/image";
import type { Look, StyleId } from "@/lib/app/catalog";
import styles from "./Cover.module.css";
import { lookStyle } from "./document";
import { Drawing, Photo } from "./Visuals";

type CoverProps = {
  style: StyleId;
  look: Look;
  title: string;
  author?: string;
  series?: string;
  /* An imported photo, used by the photographic style */
  image?: string;
  logo?: string | null;
  /* The large number of the Studio style */
  number?: number;
  /* Fill the parent (a page of the viewer) instead of the 3:4 book shape */
  fill?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
};

/* Front cover of an ebook in one of the six styles, at any size */
export function Cover({
  style,
  look,
  title,
  author,
  series,
  image,
  logo,
  number = 5,
  fill = false,
  eager = false,
  sizes = "220px",
  className,
}: CoverProps) {
  const size = title.length > 42 ? styles.long : title.length > 22 ? styles.medium : "";
  const classes = [styles.cover, styles[style], fill && styles.fill, look.textured && styles.textured, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={lookStyle(look)} data-part="cover">
      <div className={styles.inner}>
        {style === "botanica" && (
          <>
            <Photo src={image} index={0} sizes={sizes} eager={eager} className={styles.photo} />
            <span className={styles.veil} />
          </>
        )}
        {style === "notes" && <span className={styles.stamp} />}
        {style === "editorial" && <span className={styles.frame} />}
        {style === "gallery" && <Drawing index={0} className={styles.drawing} />}
        {style === "studio" && <span className={styles.big}>{String(number).padStart(2, "0")}</span>}

        {series && <span className={styles.series}>{series}</span>}
        <span className={`${styles.titleBlock} ${size}`}>
          <span className={styles.title}>{title}</span>
          {style === "monograph" && <span className={styles.rule} />}
        </span>
        {author && <span className={styles.byline}>{author}</span>}
        {logo && (
          <span className={styles.logo}>
            <Image src={logo} alt="" fill sizes="40px" style={{ objectFit: "contain" }} />
          </span>
        )}
      </div>
    </div>
  );
}
