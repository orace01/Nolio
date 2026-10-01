import { useEffect } from "react";
import { Book } from "@/components/book/Book";
import { Hero } from "@/components/hero/Hero";
import { AboutPage } from "@/components/pages/AboutPage";
import { FormatsPage } from "@/components/pages/FormatsPage";
import { PricingPage } from "@/components/pages/PricingPage";
import { ProcessPage } from "@/components/pages/ProcessPage";
import { StartPage } from "@/components/pages/StartPage";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import "../site/globals.css";

/* La page d'accueil du site : le livre de six pages, en français ou en anglais */
export default function SiteHome({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  useEffect(() => {
    document.title = dict.meta.title;
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dict.meta.description);
  }, [dict, lang]);

  return (
    <main className="nolio-site">
      <Book
        lang={lang}
        nav={dict.nav}
        ui={dict.book}
        top={dict.top}
        pages={[
          {
            id: "home",
            title: dict.nav.home,
            content: <Hero t={dict.hero} nav={dict.nav} />,
            cover: true,
          },
          { id: "about", title: dict.nav.about, content: <AboutPage t={dict.about} /> },
          { id: "formats", title: dict.nav.formats, content: <FormatsPage t={dict.formats} /> },
          { id: "process", title: dict.nav.process, content: <ProcessPage t={dict.process} /> },
          { id: "pricing", title: dict.nav.pricing, content: <PricingPage lang={lang} t={dict.pricing} /> },
          {
            id: "start",
            title: dict.nav.start,
            content: <StartPage lang={lang} t={dict.start} />,
            leftTone: "light",
          },
        ]}
      />
    </main>
  );
}
