import { BrandKit } from "@/components/app/dashboard/BrandKit";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("brand");

export default function Page() {
  return <BrandKit />;
}
