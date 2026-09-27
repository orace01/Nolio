import { CreatingView } from "@/components/app/ebooks/CreatingView";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("creating");

export default function Page() {
  return <CreatingView />;
}
