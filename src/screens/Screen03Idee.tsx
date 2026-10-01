import { Link } from "react-router";
import "./Screen03Idee.css";

/* 03 · Votre idée (1. Votre idée) */
export default function Screen03Idee() {
  return (
    <div className="s-03-idee">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="current"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li><span className="n">2</span><span className="name">Précisions</span></li>
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
              <p className="kicker">Étape 1 · Votre idée</p>
              <h1 className="question">Décrivez votre idée d’ebook.</h1>
              <p className="lead">En quelques phrases, comme vous l’expliqueriez à un ami&nbsp;: le sujet, pour qui, et ce que vous voulez transmettre.</p>
              <div className="flow-body">
                <textarea className="big-textarea" aria-label="Votre idée d’ebook" defaultValue={"Un guide pratique pour aider les indépendants débordés à mieux gérer leur temps. Je veux présenter mes 5 rituels, avec une courte vidéo pour chacun, et finir par une invitation à réserver un appel découverte avec moi."} />
                <div className="examples">
                  <p className="label">Pour vous inspirer</p>
                  <ul>
                    <li>Un guide pour débuter le yoga à la maison, avec mes vidéos de postures.</li>
                    <li>Un carnet de recettes de saison, avec un lien vers chaque recette filmée.</li>
                    <li>Une checklist pour lancer sa boutique en ligne en un mois.</li>
                  </ul>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/premier-ebook" className="arrow-link">Retour</Link>
                
                <Link to="/analyse" className="btn btn-primary">Analyser mon idée</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
