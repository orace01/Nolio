import type { ReactNode } from "react";
import shell from "@/components/app/shell/AppShell.module.css";
import { CreationTopBar, DraftStepTracker } from "@/components/app/shell/TopBar";

export default function NewEbookLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CreationTopBar />
      <DraftStepTracker />
      <main className={shell.main}>{children}</main>
    </>
  );
}
