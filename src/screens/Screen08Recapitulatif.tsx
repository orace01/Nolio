import { Link } from "react-router";
import "./Screen08Recapitulatif.css";

/* 08 · Récapitulatif (2. Précisions) */
export default function Screen08Recapitulatif() {
  return (
    <div className="s-08-recapitulatif">
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
              <p className="kicker">Récapitulatif</p>
              <h1 className="question">Voici ce sur quoi on s’entend.</h1>
              <p className="lead">Vérifiez que tout est juste&nbsp;: vous pouvez modifier chaque point.</p>
              <div className="flow-body">
                <dl className="recap">
                  <div><dt>Votre ebook</dt><dd>Un guide pratique pour mieux gérer son temps, en 5 rituels.</dd><Link to="/idee">Modifier</Link></div>
                  <div><dt>Pour</dt><dd>Des indépendants débordés.</dd><Link to="/pour-qui">Modifier</Link></div>
                  <div><dt>Objectif</dt><dd>Leur donner envie de réserver un appel découverte.</dd><Link to="/analyse">Modifier</Link></div>
                  <div><dt>Vidéos et liens</dt><dd>2 vidéos et 1 lien de rendez-vous.</dd><Link to="/videos-liens">Modifier</Link></div>
                  <div><dt>Longueur</dt><dd>Court, 8 à 15 pages.</dd><Link to="/longueur">Modifier</Link></div>
                </dl>
              </div>
              <div className="flow-actions">
                <Link to="/longueur" className="arrow-link">Retour</Link>
                
                <Link to="/style" className="btn btn-primary">C’est bien ça, passons au design</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
