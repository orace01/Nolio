import { ImagesStep } from "@/components/app/steps/ImagesStep";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("images");

export default function Page() {
  return <ImagesStep />;
}
