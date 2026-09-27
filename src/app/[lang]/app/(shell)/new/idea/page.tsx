import { IdeaStep } from "@/components/app/steps/IdeaStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("idea");

export default function Page() {
  return <IdeaStep />;
}
