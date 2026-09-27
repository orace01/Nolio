import { WelcomeStep } from "@/components/app/steps/WelcomeStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("welcome");

export default function Page() {
  return <WelcomeStep />;
}
