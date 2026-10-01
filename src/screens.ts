import { lazy, type LazyExoticComponent, type ComponentType } from "react";

/* Les écrans du parcours, dans l'ordre. Chacun est chargé à la demande. */
export type ScreenInfo = {
  id: string;
  title: string;
  group: string;
  path: string;
  Component: LazyExoticComponent<ComponentType>;
};

export const SCREENS: ScreenInfo[] = [
  { id: "00", title: "Connexion", group: "Accueil", path: "/connexion", Component: lazy(() => import("./screens/Screen00Connexion")) },
  { id: "01", title: "Bienvenue", group: "Accueil", path: "/bienvenue", Component: lazy(() => import("./screens/Screen01Bienvenue")) },
  { id: "02", title: "Votre premier ebook", group: "Accueil", path: "/premier-ebook", Component: lazy(() => import("./screens/Screen02PremierEbook")) },
  { id: "03", title: "Votre idée", group: "1. Votre idée", path: "/idee", Component: lazy(() => import("./screens/Screen03Idee")) },
  { id: "04", title: "Analyse de l’idée", group: "1. Votre idée", path: "/analyse", Component: lazy(() => import("./screens/Screen04Analyse")) },
  { id: "05", title: "Pour qui", group: "2. Précisions", path: "/pour-qui", Component: lazy(() => import("./screens/Screen05PourQui")) },
  { id: "06", title: "Vidéos et liens", group: "2. Précisions", path: "/videos-liens", Component: lazy(() => import("./screens/Screen06VideosLiens")) },
  { id: "07", title: "Longueur", group: "2. Précisions", path: "/longueur", Component: lazy(() => import("./screens/Screen07Longueur")) },
  { id: "08", title: "Récapitulatif", group: "2. Précisions", path: "/recapitulatif", Component: lazy(() => import("./screens/Screen08Recapitulatif")) },
  { id: "09", title: "Style", group: "3. Design", path: "/style", Component: lazy(() => import("./screens/Screen09Style")) },
  { id: "10", title: "Option Premium", group: "3. Design", path: "/option-premium", Component: lazy(() => import("./screens/Screen10OptionPremium")) },
  { id: "11", title: "Couleurs et police", group: "3. Design", path: "/couleurs", Component: lazy(() => import("./screens/Screen11Couleurs")) },
  { id: "12", title: "Type d’écriture", group: "3. Design", path: "/ecriture", Component: lazy(() => import("./screens/Screen12Ecriture")) },
  { id: "13", title: "Illustrations", group: "3. Design", path: "/illustrations", Component: lazy(() => import("./screens/Screen13Illustrations")) },
  { id: "14", title: "Images", group: "3. Design", path: "/images", Component: lazy(() => import("./screens/Screen14Images")) },
  { id: "15", title: "Validation", group: "4. Validation", path: "/validation", Component: lazy(() => import("./screens/Screen15Validation")) },
  { id: "16", title: "Création en cours", group: "4. Validation", path: "/creation", Component: lazy(() => import("./screens/Screen16Creation")) },
  { id: "17", title: "Votre ebook", group: "5. Votre ebook", path: "/votre-ebook", Component: lazy(() => import("./screens/Screen17VotreEbook")) },
  { id: "18", title: "Téléchargement", group: "5. Votre ebook", path: "/telechargement", Component: lazy(() => import("./screens/Screen18Telechargement")) },
  { id: "19", title: "Bibliothèque", group: "Ensuite", path: "/bibliotheque", Component: lazy(() => import("./screens/Screen19Bibliotheque")) },
  { id: "20", title: "Kit de marque", group: "Ensuite", path: "/kit-de-marque", Component: lazy(() => import("./screens/Screen20KitDeMarque")) },
  { id: "21", title: "Compte et abonnement", group: "Ensuite", path: "/compte", Component: lazy(() => import("./screens/Screen21Compte")) },
];
