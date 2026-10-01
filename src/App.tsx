import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { DEFAULT_LOCALE, hasLocale, LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/config";
import { ProtoBar } from "./components/ProtoBar";
import Board from "./pages/Board";
import Preview from "./pages/Preview";
import SiteHome from "./pages/SiteHome";
import { SCREENS, type ScreenInfo } from "./screens";

export default function App() {
  return (
    <Routes>
      {/* Le site */}
      <Route path="/" element={<Navigate to={`/${preferredLocale()}`} replace />} />
      {LOCALES.map((lang) => (
        <Route key={lang} path={`/${lang}`} element={<SiteHome lang={lang} />} />
      ))}
      {/* Compte : pour l'instant, la connexion de la maquette */}
      {LOCALES.map((lang) => (
        <Route key={`${lang}-other`} path={`/${lang}/*`} element={<SitePage lang={lang} />} />
      ))}

      {/* La maquette de l'application */}
      <Route path="/parcours" element={<Board />} />
      <Route path="/parcours/apercu" element={<Preview />} />
      {SCREENS.map((screen) => (
        <Route key={screen.path} path={screen.path} element={<Screen screen={screen} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* Pages du site pas encore portées : la connexion et l'inscription mènent à la
   maquette, le reste à l'accueil */
function SitePage({ lang }: { lang: Locale }) {
  const rest = location.pathname.slice(lang.length + 2);
  return <Navigate to={/^(login|signup|forgot-password)/.test(rest) ? "/connexion" : `/${lang}`} replace />;
}

/* La langue choisie avec le sélecteur, sinon celle du navigateur */
function preferredLocale(): Locale {
  const saved = document.cookie.match(new RegExp(`${LOCALE_COOKIE}=([a-z]{2})`))?.[1];
  if (saved && hasLocale(saved)) return saved;
  const browser = navigator.languages.map((language) => language.slice(0, 2)).find(hasLocale);
  return browser ?? DEFAULT_LOCALE;
}

/* Un écran du parcours, avec la barre de navigation de la maquette */
function Screen({ screen }: { screen: ScreenInfo }) {
  useEffect(() => {
    document.title = `Nolio · ${screen.title}`;
    document.documentElement.lang = "fr";
  }, [screen]);

  return (
    <>
      <Suspense fallback={null}>
        <screen.Component />
      </Suspense>
      <ProtoBar />
    </>
  );
}
