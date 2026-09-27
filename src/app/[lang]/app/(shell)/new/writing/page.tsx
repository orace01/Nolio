import { WritingStep } from "@/components/app/steps/WritingStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("writing");

export default function Page() {
  return <WritingStep />;
}
