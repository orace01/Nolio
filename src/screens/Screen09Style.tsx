import { Link } from "react-router";
import "./Screen09Style.css";

/* 09 · Style (3. Design) */
export default function Screen09Style() {
  return (
    <div className="s-09-style">
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
              <p className="kicker">Design · 1 sur 5</p>
              <h1 className="question">Choisissez un style.</h1>
              <p className="lead">Des styles conçus par nos designers. Les styles Basiques sont inclus&nbsp;; les styles Premium font partie des formules payantes.</p>
              <div className="flow-body">
                <div className="options three styles">
                  <div className="option selected"><div className="preview"><span className="cover monograph"><span className="title" style={{ top: "28%" }}>La méthode focus</span><span className="rule" style={{ top: "64%" }}></span></span></div><span className="title">Monographie <span className="tag tag-ok">Basique</span></span><span className="desc">Typographie pure, grille stricte.</span></div>
                  <div className="option"><div className="preview"><span className="cover botanica"><span className="title">La méthode focus</span></span></div><span className="title">Botanica <span className="tag tag-ok">Basique</span></span><span className="desc">Photographique et calme.</span></div>
                  <div className="option"><div className="preview"><span className="cover notes"><span className="title">La méthode focus</span></span></div><span className="title">Carnet <span className="tag tag-ok">Basique</span></span><span className="desc">Pages légères, pensées pour annoter.</span></div>
                  <Link to="/option-premium" className="option"><div className="preview"><span className="cover studio"><span className="big">05</span><span className="title">La méthode focus</span></span></div><span className="title">Studio <span className="tag">Premium</span></span><span className="desc">Aplats de couleur, chiffres géants.</span></Link>
                  <Link to="/option-premium" className="option"><div className="preview"><span className="cover editorial"><span className="title">La méthode focus</span></span></div><span className="title">Éditorial <span className="tag">Premium</span></span><span className="desc">Serif classique, allure de magazine.</span></Link>
                  <Link to="/option-premium" className="option"><div className="preview"><span className="cover gallery-style"><svg viewBox="0 0 60 40" aria-hidden="true"><path d="M4 36h52M12 36V20h14v16M16 20v-6h6v6M36 36V12l10-6v30M40 16h2M40 22h2M40 28h2" /><circle cx="50" cy="8" r="3" /></svg><span className="title">La méthode focus</span></span></div><span className="title">Galerie <span className="tag">Premium</span></span><span className="desc">Illustrations cohérentes d’un bout à l’autre.</span></Link>
                </div>
                <div className="own"><span className="small">Vous préférez vos propres réglages&nbsp;? <b>Créer mon style</b>, avec vos couleurs, vos polices et vos marges.</span><span className="tag tag-pro">Pro</span></div>
              </div>
              <div className="flow-actions">
                <Link to="/recapitulatif" className="arrow-link">Retour</Link>
                
                <Link to="/couleurs" className="btn btn-primary">Continuer avec Monographie</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
