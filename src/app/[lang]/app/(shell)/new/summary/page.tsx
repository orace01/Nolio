import { SummaryStep } from "@/components/app/steps/SummaryStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("summary");

export default function Page() {
  return <SummaryStep />;
}
