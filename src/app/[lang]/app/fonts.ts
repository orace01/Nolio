import {
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Inter,
  Lato,
  Playfair_Display,
  Source_Serif_4,
} from "next/font/google";

/*
 * The fonts of the ebook themes (Montserrat comes from the root layout).
 * Not preloaded: each one downloads only once a page actually uses it.
 */
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: false,
});
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], preload: false });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], preload: false });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], preload: false });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700"], preload: false });
const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], preload: false });

export const themeFonts = [sourceSerif, fraunces, inter, playfair, lato, dmSerif, dmSans]
  .map((font) => font.variable)
  .join(" ");
