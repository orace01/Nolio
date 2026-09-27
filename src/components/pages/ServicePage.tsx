import { ArrowLink } from "@/components/shared/ArrowLink";
import texture from "@/components/shared/Texture.module.css";
import page from "./page.module.css";
import styles from "./ServicePage.module.css";

const STEPS = [
  {
    title: "Describe",
    text: "Share your subject, your readers and what the book should achieve.",
  },
  {
    title: "Direct",
    text: "Set the tone, the target length and the art direction.",
  },
  {
    title: "Validate",
    text: "Review the outline. Move, rename or cut chapters before writing starts.",
  },
  {
    title: "Refine",
    text: "Generate each chapter, then edit the text and the layout page by page.",
  },
  {
    title: "Export",
    text: "Download a print-ready PDF or an EPUB for e‑readers.",
  },
];

export function ServicePage() {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.head}>
          <div>
            <p className={page.kicker}>Service</p>
            <h2 className={page.title}>From brief to finished book, in five steps.</h2>
          </div>
          <p className={page.lead}>
            You stay the author from the first brief to the last page. Nolio
            does the heavy lifting in between, and nothing moves forward
            without your approval.
          </p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <div className={styles.stepHead}>
                <span className={`${texture.textured} ${styles.stepNumber}`} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {index < STEPS.length - 1 && <span className={styles.stepLine} />}
              </div>
              <h3 className={`${page.label} ${styles.stepTitle}`}>{step.title}</h3>
              <p className={`${page.small} ${styles.stepText}`}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <ArrowLink href="#contact" className={page.next}>
        Join the waitlist
      </ArrowLink>
    </>
  );
}
