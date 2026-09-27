/*
 * Navigation de la maquette : barre sous la carte (précédent, parcours,
 * suivant) et flèches du clavier. La liste sert aussi à la planche index.html.
 */
window.NOLIO_SCREENS = [
  { file: "00-connexion.html", title: "Connexion", group: "Accueil" },
  { file: "01-bienvenue.html", title: "Bienvenue", group: "Accueil" },
  { file: "02-premier-ebook.html", title: "Votre premier ebook", group: "Accueil" },
  { file: "03-idee.html", title: "Votre idée", group: "1. Votre idée" },
  { file: "04-analyse.html", title: "Analyse de l’idée", group: "1. Votre idée" },
  { file: "05-pour-qui.html", title: "Pour qui", group: "2. Précisions" },
  { file: "06-videos-liens.html", title: "Vidéos et liens", group: "2. Précisions" },
  { file: "07-longueur.html", title: "Longueur", group: "2. Précisions" },
  { file: "08-recapitulatif.html", title: "Récapitulatif", group: "2. Précisions" },
  { file: "09-style.html", title: "Style", group: "3. Design" },
  { file: "10-option-premium.html", title: "Option Premium", group: "3. Design" },
  { file: "11-couleurs.html", title: "Couleurs et police", group: "3. Design" },
  { file: "12-ecriture.html", title: "Type d’écriture", group: "3. Design" },
  { file: "13-illustrations.html", title: "Illustrations", group: "3. Design" },
  { file: "14-images.html", title: "Images", group: "3. Design" },
  { file: "15-validation.html", title: "Validation", group: "4. Validation" },
  { file: "16-creation.html", title: "Création en cours", group: "4. Validation" },
  { file: "17-votre-ebook.html", title: "Votre ebook", group: "5. Votre ebook" },
  { file: "18-telechargement.html", title: "Téléchargement", group: "5. Votre ebook" },
  { file: "19-bibliotheque.html", title: "Bibliothèque", group: "Ensuite" },
  { file: "20-kit-de-marque.html", title: "Kit de marque", group: "Ensuite" },
  { file: "21-compte.html", title: "Compte et abonnement", group: "Ensuite" },
];

(function () {
  // Dans la planche, chaque écran est affiché sans sa barre de navigation
  if (window.self !== window.top) {
    document.documentElement.classList.add("embedded");
    return;
  }

  const screens = window.NOLIO_SCREENS;
  const file = location.pathname.split("/").pop();
  const index = screens.findIndex((screen) => screen.file === file);
  if (index < 0) return;

  const previous = screens[index - 1];
  const next = screens[index + 1];
  const pad = (value) => String(value).padStart(2, "0");
  const link = (screen, label) =>
    screen ? `<a href="${screen.file}">${label}</a>` : `<a href="#" aria-disabled="true">${label}</a>`;

  const bar = document.createElement("nav");
  bar.className = "proto";
  bar.setAttribute("aria-label", "Navigation de la maquette");
  bar.innerHTML = `
    <span class="where">Maquette ${pad(index)} / ${pad(screens.length - 1)} : ${screens[index].title}</span>
    ${link(previous, "Précédent")}
    <a href="index.html">Parcours</a>
    ${link(next, "Suivant")}`;
  document.body.appendChild(bar);

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight" && next) location.href = next.file;
    if (event.key === "ArrowLeft" && previous) location.href = previous.file;
  });
})();
