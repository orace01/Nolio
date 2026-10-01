import { Link } from "react-router";

/* 05 · Pour qui (2. Précisions) */
export default function Screen05PourQui() {
  return (
    <div className="s-05-pour-qui">
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
              <p className="kicker">Précision 1 sur 3</p>
              <h1 className="question">À qui s’adresse cet ebook&nbsp;?</h1>
              <p className="lead">Nolio a repéré ces profils dans votre idée. Choisissez-en un ou plusieurs.</p>
              <div className="flow-body">
                <div className="options">
                  <div className="option selected"><span className="title">Indépendants débordés</span><span className="desc">Freelances qui travaillent seuls et courent après le temps. <b>Repéré dans votre idée.</b></span></div>
                  <div className="option"><span className="title">Salariés en télétravail</span><span className="desc">Ils organisent seuls leur journée, loin du bureau.</span></div>
                  <div className="option"><span className="title">Dirigeants de petite entreprise</span><span className="desc">Ils jonglent entre la gestion et leur métier.</span></div>
                  <div className="option"><span className="title">Autre public</span><span className="desc">Décrivez-le avec vos mots.</span></div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/analyse" className="arrow-link">Retour</Link>
                
                <Link to="/videos-liens" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
