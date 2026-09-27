import { notFound } from "next/navigation";
import { Book } from "@/components/book/Book";
import { Hero } from "@/components/hero/Hero";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { FormatsPage } from "@/components/pages/FormatsPage";
import { ProcessPage } from "@/components/pages/ProcessPage";
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
            id: "contact",
            title: dict.nav.contact,
            content: <ContactPage t={dict.contact} />,
            leftTone: "light",
          },
        ]}
      />
    </main>
  );
}
