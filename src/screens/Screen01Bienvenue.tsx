import { Link } from "react-router";

/* 01 · Bienvenue (Accueil) */
export default function Screen01Bienvenue() {
  return (
    <div className="s-01-bienvenue">
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
              <p className="kicker">Bienvenue, Camille</p>
              <h1 className="question">Qu’est-ce qui vous décrit le mieux&nbsp;?</h1>
              <p className="lead">Nolio adaptera ses exemples et ses propositions à votre activité. Vous pourrez le changer plus tard.</p>
              <div className="flow-body">
                <div className="options three">
                  <div className="option selected"><span className="title">Coach</span><span className="desc">Vous accompagnez des clients.</span></div>
                  <div className="option"><span className="title">Formateur</span><span className="desc">Vous donnez des cours ou des ateliers.</span></div>
                  <div className="option"><span className="title">Créateur de contenu</span><span className="desc">Vous animez une audience en ligne.</span></div>
                  <div className="option"><span className="title">Entrepreneur</span><span className="desc">Vous vendez un produit ou un service.</span></div>
                  <div className="option"><span className="title">Autre</span><span className="desc">Dites-le avec vos mots.</span></div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/connexion" className="arrow-link">Retour</Link>
                
                <Link to="/premier-ebook" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
