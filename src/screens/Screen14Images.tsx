import { Link } from "react-router";
import "./Screen14Images.css";

/* 14 · Images (3. Design) */
export default function Screen14Images() {
  return (
    <div className="s-14-images">
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
              <p className="kicker">Design · 5 sur 5</p>
              <h1 className="question">Vos images.</h1>
              <p className="lead">Importez vos photos, ou laissez l’IA créer des images dans le style choisi.</p>
              <div className="flow-body">
                <div className="two">
                  <div className="option selected">
                    <span className="title">Importer mes images <span className="tag tag-ok">Basique</span></span>
                    <div className="drop">
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" /></svg>
                      <span className="small">Déposez vos photos ici<br /><span className="hint">JPG ou PNG, jusqu’à 10 Mo chacune</span></span>
                    </div>
                    <div className="thumbs"><span></span><span></span><span><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="8" /><path d="M4 40c0-9 7-15 16-15s16 6 16 15z" /></svg></span></div>
                    <span className="hint">3 images importées. Nolio les place là où elles servent le texte.</span>
                  </div>
                  <div className="option locked">
                    <span className="title">Générer avec l’IA <span className="tag tag-pro">Pro</span></span>
                    <input className="input" defaultValue="Un bureau calme au lever du jour, une tasse et un carnet" disabled />
                    <div className="generated"><span><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M8 64h104M20 64l10-18h34l10 18M34 46h26M82 64V52h16v12M98 55c6 0 6 7 0 7M86 48c0-4 4-4 4-8M92 48c0-4 4-4 4-8" /><rect x="14" y="8" width="44" height="28" /><path d="M14 29c9-7 17-7 26 0s12 6 18 1" /><circle cx="46" cy="18" r="5" /></svg></span><span><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M8 64h104M20 64l10-18h34l10 18M34 46h26M82 64V52h16v12M98 55c6 0 6 7 0 7M86 48c0-4 4-4 4-8M92 48c0-4 4-4 4-8" /><rect x="14" y="8" width="44" height="28" /><path d="M14 29c9-7 17-7 26 0s12 6 18 1" /><circle cx="46" cy="18" r="5" /></svg></span></div>
                    <span className="desc">Des images créées dans le style d’illustration choisi. Disponible avec la formule Pro.</span>
                    <div><Link to="/compte" className="btn btn-secondary btn-small">Découvrir Pro</Link></div>
                  </div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/illustrations" className="arrow-link">Retour</Link>
                <Link to="/validation" className="arrow-link">Passer cette étape</Link>
                <Link to="/validation" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
