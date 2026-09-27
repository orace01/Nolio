import { Account } from "@/components/app/dashboard/Account";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("profile");

export default function Page() {
  return <Account />;
}
