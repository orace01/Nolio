import { OverviewStep } from "@/components/app/steps/OverviewStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("overview");

export default function Page() {
  return <OverviewStep />;
}
