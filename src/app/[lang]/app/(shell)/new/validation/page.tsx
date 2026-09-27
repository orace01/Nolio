import { ValidationStep } from "@/components/app/steps/ValidationStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("validation");

export default function Page() {
  return <ValidationStep />;
}
