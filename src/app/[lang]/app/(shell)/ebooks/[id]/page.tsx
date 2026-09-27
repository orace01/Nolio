import { ViewerView } from "@/components/app/ebooks/ViewerView";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("ebook");

export default function Page() {
  return <ViewerView />;
}
