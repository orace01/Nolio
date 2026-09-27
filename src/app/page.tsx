import { Book } from "@/components/book/Book";
import { Hero } from "@/components/hero/Hero";
import { AboutPage } from "@/components/pages/AboutPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { ProductsPage } from "@/components/pages/ProductsPage";
import { ServicePage } from "@/components/pages/ServicePage";

export default function Home() {
  return (
    <main>
      <Book
        pages={[
          { id: "home", title: "Home", content: <Hero />, cover: true },
          { id: "about", title: "About", content: <AboutPage /> },
          { id: "products", title: "Products", content: <ProductsPage /> },
          { id: "service", title: "Service", content: <ServicePage /> },
          {
            id: "contact",
            title: "Contact",
            content: <ContactPage />,
            leftTone: "light",
          },
        ]}
      />
    </main>
  );
}
