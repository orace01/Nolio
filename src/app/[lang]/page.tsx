import { notFound } from "next/navigation";
import { Book } from "@/components/book/Book";
import { Hero } from "@/components/hero/Hero";
import { AboutPage } from "@/components/pages/AboutPage";
import { FormatsPage } from "@/components/pages/FormatsPage";
import { PricingPage } from "@/components/pages/PricingPage";
import { ProcessPage } from "@/components/pages/ProcessPage";
import { StartPage } from "@/components/pages/StartPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <main>
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
          {
            id: "formats",
            title: dict.nav.formats,
            content: <FormatsPage t={dict.formats} />,
          },
          {
            id: "process",
            title: dict.nav.process,
            content: <ProcessPage t={dict.process} />,
          },
          {
            id: "pricing",
            title: dict.nav.pricing,
            content: <PricingPage lang={lang} t={dict.pricing} />,
          },
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
