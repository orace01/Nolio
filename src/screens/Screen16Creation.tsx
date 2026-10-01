import { Link } from "react-router";
import "./Screen16Creation.css";

/* 16 · Création en cours (4. Validation) */
export default function Screen16Creation() {
  return (
    <div className="s-16-creation">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="done"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li className="done"><span className="n">2</span><span className="name">Précisions</span></li>
              <li className="done"><span className="n">3</span><span className="name">Design</span></li>
              <li className="current"><span className="n">4</span><span className="name">Validation</span></li>
              <li><span className="n">5</span><span className="name">Votre ebook</span></li>
            </ol>
            <div className="user" style={{ marginLeft: "0" }}>
              <Link to="/bibliotheque" className="save">Enregistrer et quitter</Link>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="flow">
            <div className="flow-inner">
              <p className="kicker">Création en cours</p>
              <h1 className="question">Nous créons votre ebook.</h1>
              <p className="lead">Restez ici ou revenez plus tard&nbsp;: nous vous prévenons par email dès qu’il est prêt.</p>
              <div className="flow-body">
                <div className="bar"><span style={{ width: "68%" }}></span></div>
                <p className="hint" style={{ marginTop: "8px" }}>Encore environ 1 minute.</p>
                <ul className="tasks" style={{ marginTop: "24px" }}>
                  <li><span>Rédaction du texte</span><span></span><span className="state">Terminé</span></li>
                  <li><span>Mise en page</span><span></span><span className="state">Terminé</span></li>
                  <li><span>Intégration des vidéos et des liens</span><span className="bar"><span style={{ width: "55%" }}></span></span><span className="state">En cours</span></li>
                  <li><span>Dernière vérification</span><span></span><span className="state waiting">À venir</span></li>
                </ul>
              </div>
              <div className="flow-actions">
                <Link to="/bibliotheque" className="arrow-link">Revenir à la bibliothèque</Link>
                
                <Link to="/votre-ebook" className="btn btn-primary">Voir mon ebook</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
