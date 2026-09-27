import { StudioStep } from "@/components/app/steps/StudioStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("studio");

export default function Page() {
  return <StudioStep />;
}
