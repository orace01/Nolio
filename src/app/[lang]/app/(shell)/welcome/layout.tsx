import type { ReactNode } from "react";
import shell from "@/components/app/shell/AppShell.module.css";
import { PlainTopBar } from "@/components/app/shell/TopBar";

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PlainTopBar />
      <main className={shell.main}>{children}</main>
    </>
  );
}
