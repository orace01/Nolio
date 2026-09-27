import type { ReactNode } from "react";
import shell from "@/components/app/shell/AppShell.module.css";
import { DashboardTopBar } from "@/components/app/shell/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardTopBar />
      <main className={shell.main}>{children}</main>
    </>
  );
}
