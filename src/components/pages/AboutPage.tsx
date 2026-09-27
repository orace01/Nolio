import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";
import { ArrowLink } from "@/components/shared/ArrowLink";
import page from "./page.module.css";
import styles from "./AboutPage.module.css";

const PRINCIPLES = [
  {
    title: "Your voice",
    text: "Built from your notes, your method and your readers, never from generic filler.",
  },
  {
    title: "A real outline",
    text: "Every chapter follows a plan you approve before a single page is written.",
  },
  {
    title: "Designed pages",
    text: "Typography and art direction created by designers and applied to every spread.",
  },
];

export function AboutPage() {
  return (
    <>
      <div className={styles.text}>
        <p className={page.kicker}>About Nolio</p>
        <h2 className={page.title}>Ebooks that read like real books.</h2>
        <p className={page.lead}>
          Nolio turns what you know into an ebook with the structure, the voice
          and the design of a published title. Choose a niche, a length and an
          art direction: Nolio plans the book with you, writes it with you and
          lays it out page by page.
        </p>
        <ol className={styles.principles}>
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.title}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={`${page.label} ${styles.principleTitle}`}>
                {principle.title}
              </h3>
              <p className={`${page.small} ${styles.principleText}`}>
                {principle.text}
              </p>
            </li>
          ))}
        </ol>
        <ArrowLink href="#products" className={styles.more}>
          Next page
        </ArrowLink>
      </div>

      <div className={styles.photo}>
        <Image
          src={leaves}
          alt=""
          fill
          sizes="30vw"
          className={styles.photoImage}
        />
        <span className={`${page.bigNumber} ${styles.bigNumber}`} aria-hidden="true">
          02
        </span>
      </div>
    </>
  );
}
