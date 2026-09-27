import { Library } from "@/components/app/dashboard/Library";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("library");

export default function Page() {
  return <Library />;
}
