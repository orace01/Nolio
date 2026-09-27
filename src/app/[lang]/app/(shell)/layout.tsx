import type { ReactNode } from "react";
import shell from "@/components/app/shell/AppShell.module.css";
import { PremiumProvider } from "@/components/app/ui/Premium";

/* Every app screen sits in the framed card on the grey stage */
export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className={shell.stage}>
      <div className={shell.card}>
        <PremiumProvider>{children}</PremiumProvider>
      </div>
    </div>
  );
}
