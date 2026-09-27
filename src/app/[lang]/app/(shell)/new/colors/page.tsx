import { ColorsStep } from "@/components/app/steps/ColorsStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("colors");

export default function Page() {
  return <ColorsStep />;
}
