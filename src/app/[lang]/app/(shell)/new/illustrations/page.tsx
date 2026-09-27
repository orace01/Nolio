import { IllustrationsStep } from "@/components/app/steps/IllustrationsStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("illustrations");

export default function Page() {
  return <IllustrationsStep />;
}
