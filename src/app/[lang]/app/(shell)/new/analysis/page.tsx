import { AnalysisStep } from "@/components/app/steps/AnalysisStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("analysis");

export default function Page() {
  return <AnalysisStep />;
}
