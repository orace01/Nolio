import { Link } from "react-router";
import "./Screen13Illustrations.css";

/* 13 · Illustrations (3. Design) */
export default function Screen13Illustrations() {
  return (
    <div className="s-13-illustrations">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="done"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li className="done"><span className="n">2</span><span className="name">Précisions</span></li>
              <li className="current"><span className="n">3</span><span className="name">Design</span></li>
              <li><span className="n">4</span><span className="name">Validation</span></li>
              <li><span className="n">5</span><span className="name">Votre ebook</span></li>
            </ol>
            <div className="user" style={{ marginLeft: "0" }}>
              <Link to="/bibliotheque" className="save">Enregistrer et quitter</Link>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="flow">
            <div className="flow-inner wide">
              <p className="kicker">Design · 4 sur 5</p>
              <h1 className="question">Quel type d’illustrations&nbsp;?</h1>
              <p className="lead">Elles accompagnent le texte de chaque partie.</p>
              <div className="flow-body">
                <div className="options three">
                  <div className="option illus"><div className="preview"><div className="lines"><span></span><span></span><span></span><span style={{ width: "80%" }}></span></div></div><span className="title">Aucune <span className="tag tag-ok">Basique</span></span><span className="desc">La typographie seule, très épurée.</span></div>
                  <div className="option illus"><div className="preview"><div className="photo"></div></div><span className="title">Photos <span className="tag tag-ok">Basique</span></span><span className="desc">Vos photos ou des banques d’images libres.</span></div>
                  <div className="option selected illus"><div className="preview"><svg viewBox="0 0 120 50" aria-hidden="true"><circle cx="22" cy="25" r="12" /><path d="M22 18v7l5 3" /><rect x="48" y="13" width="24" height="24" /><path d="M53 25l5 5 9-10" /><path d="M92 37l12-24 12 24z M98 29h12" /></svg></div><span className="title">Icônes <span className="tag tag-ok">Basique</span></span><span className="desc">Des pictogrammes au trait pour chaque idée.</span></div>
                  <div className="option illus"><div className="preview"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M8 64h104M20 64l10-18h34l10 18M34 46h26M82 64V52h16v12M98 55c6 0 6 7 0 7M86 48c0-4 4-4 4-8M92 48c0-4 4-4 4-8" /><rect x="14" y="8" width="44" height="28" /><path d="M14 29c9-7 17-7 26 0s12 6 18 1" /><circle cx="46" cy="18" r="5" /></svg></div><span className="title">Dessin au trait <span className="tag">Premium</span></span><span className="desc">Des illustrations fines, dans le style du livre.</span></div>
                  <div className="option illus shapes"><div className="preview"><svg viewBox="0 0 120 60" aria-hidden="true"><circle cx="30" cy="30" r="18" fill="#2a3f34" /><rect x="52" y="14" width="30" height="30" fill="#8aa596" /><path d="M92 46l14-30 14 30z" fill="#c9b99a" /></svg></div><span className="title">Formes géométriques <span className="tag">Premium</span></span><span className="desc">Des aplats simples, aux couleurs du thème.</span></div>
                  <div className="option illus"><div className="preview"><svg viewBox="0 0 120 50" aria-hidden="true"><path d="M60 8v10M60 32v10M43 25h10M67 25h10M48 13l6 6M66 31l6 6M48 37l6-6M66 19l6-6" /></svg></div><span className="title">Style sur mesure <span className="tag tag-pro">Pro</span></span><span className="desc">Décrivez le style voulu, l’IA le crée pour vous.</span></div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/ecriture" className="arrow-link">Retour</Link>
                
                <Link to="/images" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
