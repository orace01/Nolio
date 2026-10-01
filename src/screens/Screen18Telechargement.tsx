import { Link } from "react-router";
import "./Screen18Telechargement.css";

/* 18 · Téléchargement (5. Votre ebook) */
export default function Screen18Telechargement() {
  return (
    <div className="s-18-telechargement">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="done"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li className="done"><span className="n">2</span><span className="name">Précisions</span></li>
              <li className="done"><span className="n">3</span><span className="name">Design</span></li>
              <li className="done"><span className="n">4</span><span className="name">Validation</span></li>
              <li className="current"><span className="n">5</span><span className="name">Votre ebook</span></li>
            </ol>
            <div className="user" style={{ marginLeft: "0" }}>
              <Link to="/bibliotheque" className="save">Enregistrer et quitter</Link>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="flow">
            <div className="flow-inner wide">
              <p className="kicker">Votre ebook</p>
              <h1 className="question">Votre ebook est prêt.</h1>
              <div className="flow-body">
                <div className="two">
                  <div>
                    <span className="cover monograph"><span className="title" style={{ top: "26%", fontSize: "26px" }}>La méthode focus</span><span className="rule" style={{ top: "60%" }}></span></span>
                    <p className="hint" style={{ marginTop: "14px" }}>12 pages · 2 vidéos · 1 lien · version finale</p>
                  </div>
                  <div>
                    <div className="format"><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z M14 3v4h4 M9 13h6 M9 16h6" /></svg><div><p className="t">PDF interactif <span className="tag tag-ok">Conseillé</span></p><p className="d">Vidéos et liens cliquables, à envoyer ou à mettre en ligne.</p></div><span className="tag tag-ok">Gratuit</span><span className="btn btn-primary btn-small">Télécharger</span></div>
                    <div className="format"><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4M3 7h4M17 21v-4M21 17h-4 M7 7h10v10H7z" /></svg><div><p className="t">PDF à imprimer</p><p className="d">Avec QR codes pour les vidéos, prêt pour l’imprimeur.</p></div><span className="tag">Premium</span><span className="btn btn-secondary btn-small">Débloquer</span></div>
                    <div className="format"><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z M9 8h6 M9 12h6 M9 16h3" /></svg><div><p className="t">EPUB</p><p className="d">Pour les liseuses, le texte s’adapte à l’écran.</p></div><span className="tag tag-pro">Pro</span><span className="btn btn-secondary btn-small">Débloquer</span></div>
                    <div className="format"><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z M3 15l5-5 4 4 3-3 6 6" /><circle cx="15.5" cy="9" r="1.5" /></svg><div><p className="t">Images pour vos réseaux</p><p className="d">La couverture et une maquette 3D de l’ebook.</p></div><span className="tag tag-ok">Gratuit</span><span className="btn btn-secondary btn-small">Télécharger</span></div>
                    <p className="hint" style={{ marginTop: "12px" }}>Formule Gratuite&nbsp;: une mention Nolio discrète apparaît en dernière page.</p>
                  </div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/votre-ebook" className="arrow-link">Retour</Link>
                
                <Link to="/bibliotheque" className="btn btn-primary">Aller à la bibliothèque</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
