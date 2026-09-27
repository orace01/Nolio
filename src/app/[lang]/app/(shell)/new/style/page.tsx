import { StyleStep } from "@/components/app/steps/StyleStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("style");

export default function Page() {
  return <StyleStep />;
}
