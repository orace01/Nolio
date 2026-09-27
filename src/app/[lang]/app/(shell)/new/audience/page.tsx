import { AudienceStep } from "@/components/app/steps/AudienceStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("audience");

export default function Page() {
  return <AudienceStep />;
}
