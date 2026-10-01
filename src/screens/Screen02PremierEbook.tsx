import { Link } from "react-router";
import "./Screen02PremierEbook.css";

/* 02 · Votre premier ebook (Accueil) */
export default function Screen02PremierEbook() {
  return (
    <div className="s-02-premier-ebook">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <div className="user">
              <span className="quota">Formule Gratuite</span>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="flow">
            <div className="flow-inner">
              <p className="kicker">Votre premier ebook</p>
              <h1 className="question">Cinq étapes, une chose à la fois.</h1>
              <p className="lead">Environ 10 minutes de votre temps. Nolio s’occupe du texte, de la mise en page et de l’intégration de vos vidéos.</p>
              <div className="flow-body">
                <ol className="toc" aria-label="Étapes de création">
                  <li><span className="n textured">01</span><div><p className="step">Votre idée</p><p className="small">Décrivez votre projet en quelques phrases, Nolio l’analyse.</p></div><span className="time">2 min</span></li>
                  <li><span className="n textured">02</span><div><p className="step">Précisions</p><p className="small">Quelques questions pour comprendre exactement ce que vous voulez.</p></div><span className="time">3 min</span></li>
                  <li><span className="n textured">03</span><div><p className="step">Design</p><p className="small">Style, couleurs, écriture, illustrations et images, un choix par page.</p></div><span className="time">3 min</span></li>
                  <li><span className="n textured">04</span><div><p className="step">Validation</p><p className="small">Le sommaire et un aperçu du style, avant de lancer la création.</p></div><span className="time">1 min</span></li>
                  <li><span className="n textured">05</span><div><p className="step">Votre ebook</p><p className="small">Feuilletez-le, commentez si besoin, puis téléchargez-le.</p></div><span className="time">À votre rythme</span></li>
                </ol>
              </div>
              <div className="flow-actions">
                <Link to="/bienvenue" className="arrow-link">Retour</Link>
                
                <Link to="/idee" className="btn btn-primary">Commencer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
