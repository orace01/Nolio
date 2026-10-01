import { Link } from "react-router";
import "./Screen07Longueur.css";

/* 07 · Longueur (2. Précisions) */
export default function Screen07Longueur() {
  return (
    <div className="s-07-longueur">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="done"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li className="current"><span className="n">2</span><span className="name">Précisions</span></li>
              <li><span className="n">3</span><span className="name">Design</span></li>
              <li><span className="n">4</span><span className="name">Validation</span></li>
              <li><span className="n">5</span><span className="name">Votre ebook</span></li>
            </ol>
            <div className="user" style={{ marginLeft: "0" }}>
              <Link to="/bibliotheque" className="save">Enregistrer et quitter</Link>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="flow">
            <div className="flow-inner">
              <p className="kicker">Précision 3 sur 3</p>
              <h1 className="question">Quelle longueur&nbsp;?</h1>
              <p className="lead">Un ebook court se lit d’une traite&nbsp;; un plus long peut aller plus loin.</p>
              <div className="flow-body">
                <div className="options three">
                  <div className="option selected"><span className="title">Court <span className="tag tag-ok">Basique</span></span><span className="desc"><span className="pages">8 à 15 pages</span><br />Une lecture de 10 minutes, idéale pour un premier contact. <b>Conseillé pour votre idée.</b></span></div>
                  <div className="option"><span className="title">Moyen <span className="tag">Premium</span></span><span className="desc"><span className="pages">15 à 25 pages</span><br />La place pour détailler chaque rituel.</span></div>
                  <div className="option"><span className="title">Long <span className="tag">Premium</span></span><span className="desc"><span className="pages">30 à 40 pages</span><br />Pour aller en profondeur, exercices compris.</span></div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/videos-liens" className="arrow-link">Retour</Link>
                
                <Link to="/recapitulatif" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
