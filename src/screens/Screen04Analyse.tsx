import { Link } from "react-router";
import "./Screen04Analyse.css";

/* 04 · Analyse de l’idée (1. Votre idée) */
export default function Screen04Analyse() {
  return (
    <div className="s-04-analyse">
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
              <h1 className="question">Voici ce que nous avons compris.</h1>
              <p className="lead">Nolio a analysé votre idée. Trois questions vont préciser le reste.</p>
              <div className="flow-body">
                <blockquote className="idea">«&nbsp;Un guide pratique pour aider les indépendants débordés à mieux gérer leur temps. Je veux présenter mes 5 rituels, avec une courte vidéo pour chacun…&nbsp;»</blockquote>
                <ul className="found">
                  <li><span className="check"></span><div><p className="k">Type d’ebook</p><p className="v">Un guide pratique en PDF</p></div></li>
                  <li><span className="check"></span><div><p className="k">Sujet</p><p className="v">L’organisation du temps, en 5 rituels</p></div></li>
                  <li><span className="check"></span><div><p className="k">Contenus</p><p className="v">Une courte vidéo par rituel</p></div></li>
                  <li><span className="check"></span><div><p className="k">Objectif</p><p className="v">Obtenir des rendez-vous découverte</p></div></li>
                </ul>
                <div className="open">
                  <p className="label">Encore à préciser</p>
                  <p className="small" style={{ marginTop: "4px" }}>Le public exact, les liens de vos vidéos et la longueur de l’ebook.</p>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/idee" className="arrow-link">Retour</Link>
                
                <Link to="/pour-qui" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
