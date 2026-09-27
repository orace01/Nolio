import { Account } from "@/components/app/dashboard/Account";
import { appTitle } from "@/i18n/app";

export const generateMetadata = appTitle("invoices");

export default function Page() {
  return <Account />;
}
