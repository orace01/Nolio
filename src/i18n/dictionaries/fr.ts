import type { Dictionary } from "./en";

/* French typography: a no-break space ( ) goes before ":" */
export const fr: Dictionary = {
  meta: {
    title: "Nolio",
    description:
      "Nolio transforme votre expertise en ebooks qui ressemblent à de vrais livres : un plan clair, votre propre voix et une mise en page soignée.",
  },
  nav: {
    home: "Accueil",
    about: "À propos",
    formats: "Formats",
    process: "Méthode",
    contact: "Contact",
  },
  book: {
    previous: "Page précédente",
    next: "Page suivante",
    language: "Langue",
    languageNames: { en: "English", fr: "Français" },
  },
  hero: {
    follow: "Suivre",
    slideLabel: "Couverture",
    menu: "Ouvrir le menu",
    kicker: "Votre expertise, reliée en",
    title: "Vrai livre.",
    lead: "Nolio transforme votre savoir en ebook, avec un plan clair, votre propre voix et une mise en page soignée. Choisissez une niche, une longueur et une direction artistique, puis exportez un livre que vous aurez plaisir à partager.",
    cta: "Ouvrir le livre",
  },
  about: {
    kicker: "À propos de Nolio",
    title: "Des ebooks dignes d’un vrai éditeur.",
    lead: "La plupart des ebooks générés par IA se ressemblent : chapitres creux, conseils génériques, modèle rempli au hasard. Nolio travaille comme un éditeur. Il part de votre savoir, construit le plan avec vous et donne à chaque page une vraie mise en page.",
    principles: [
      {
        title: "Votre voix",
        text: "Construit à partir de vos notes, de votre méthode et de vos lecteurs, jamais avec du remplissage générique.",
      },
      {
        title: "Un vrai plan",
        text: "Chaque chapitre suit un plan que vous validez avant qu’une seule page soit écrite.",
      },
      {
        title: "Des pages dessinées",
        text: "Typographie, grilles et direction artistique conçues par des designers, appliquées à chaque double page.",
      },
    ],
    next: "Page suivante",
  },
  formats: {
    kicker: "Formats et styles",
    title: "Votre livre, votre style.",
    lead: "Chaque ebook Nolio part d’un format et d’une direction artistique. Ensemble, ils fixent la longueur, le rythme et l’allure de chaque page.",
    caption: "Trois formats",
    rows: [
      { name: "Lead magnet", length: "15 à 30 pages", files: "PDF" },
      { name: "Guide", length: "40 à 80 pages", files: "PDF et EPUB" },
      { name: "Support de cours", length: "60 à 120 pages", files: "PDF et EPUB" },
    ],
    stylesLabel: "Directions artistiques",
    styles: {
      botanica: {
        name: "Botanica",
        description: "Photographique et calme, avec de grandes respirations.",
        coverTitle: "Une pratique plus sereine",
        coverByline: "Guide de coaching",
      },
      monograph: {
        name: "Monographie",
        description: "De la typographie pure sur une grille stricte.",
        coverTitle: "La méthode focus",
        coverByline: "Guide, 40 pages",
      },
      studio: {
        name: "Studio",
        description: "Des aplats de couleur et des chiffres géants.",
        coverTitle: "Lancer en 30 jours",
      },
      notes: {
        name: "Carnet",
        description: "Des pages légères et annotées, pensées pour les cahiers d’exercices.",
        coverTitle: "Notes sur le travail profond",
      },
    },
    next: "Page suivante",
  },
  process: {
    kicker: "Méthode",
    title: "Du brief au livre fini, en cinq étapes.",
    lead: "Vous restez l’auteur, du premier brief à la dernière page. Nolio fait le gros du travail entre les deux, et rien n’avance sans votre accord.",
    steps: [
      {
        title: "Décrire",
        text: "Présentez votre sujet, vos lecteurs et ce que le livre doit leur apporter.",
      },
      {
        title: "Orienter",
        text: "Fixez le ton, la longueur visée et la direction artistique.",
      },
      {
        title: "Valider",
        text: "Relisez le plan. Déplacez, renommez ou supprimez des chapitres avant l’écriture.",
      },
      {
        title: "Affiner",
        text: "Générez chaque chapitre, puis retouchez le texte et la mise en page, page par page.",
      },
      {
        title: "Exporter",
        text: "Téléchargez un PDF prêt à imprimer ou un EPUB pour liseuse.",
      },
    ],
    next: "Rejoindre la liste d’attente",
  },
  contact: {
    kicker: "Contact",
    title: "Rejoignez la liste d’attente.",
    lead: "Nolio ouvre ses portes à un premier groupe d’auteurs. Laissez votre email, nous vous écrirons dès que votre place sera prête.",
    form: {
      label: "Adresse email",
      placeholder: "vous@exemple.com",
      submit: "Rejoindre",
      success: "Merci. Nous vous écrirons dès que votre place sera prête.",
      error: "Merci d’indiquer une adresse email valide.",
    },
    follow: "Suivre Nolio",
    legal: "© 2026 Nolio. Tous droits réservés.",
    back: "Retour à la couverture",
  },
};
