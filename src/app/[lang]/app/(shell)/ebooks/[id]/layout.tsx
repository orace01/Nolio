import type { ReactNode } from "react";
import shell from "@/components/app/shell/AppShell.module.css";
import { CreationTopBar } from "@/components/app/shell/TopBar";

export default function EbookLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CreationTopBar />
      <main className={shell.main}>{children}</main>
    </>
  );
}
