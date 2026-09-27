import { DownloadView } from "@/components/app/ebooks/DownloadView";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("download");

export default function Page() {
  return <DownloadView />;
}
