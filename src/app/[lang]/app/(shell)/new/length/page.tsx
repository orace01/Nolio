import { LengthStep } from "@/components/app/steps/LengthStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("length");

export default function Page() {
  return <LengthStep />;
}
