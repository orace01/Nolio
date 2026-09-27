import { Montserrat } from "next/font/google";

/* Shared by the root layout and the global 404, which bypasses that layout */
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
