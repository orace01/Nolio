import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RuntimeConfig } from "@/components/app/shell/Runtime";
import { publicRuntime } from "@/server/env";
import { themeFonts } from "./fonts";

/* The app lives behind the login: keep it out of search engines */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={themeFonts}>
      <RuntimeConfig runtime={publicRuntime()} />
      {children}
    </div>
  );
}
