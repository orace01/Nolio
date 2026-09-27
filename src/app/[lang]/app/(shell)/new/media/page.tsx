import { MediaStep } from "@/components/app/steps/MediaStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("media");

export default function Page() {
  return <MediaStep />;
}
