import { Link } from "react-router";
import "./Screen12Ecriture.css";

/* 12 · Type d’écriture (3. Design) */
export default function Screen12Ecriture() {
  return (
    <div className="s-12-ecriture">
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
            <div className="flow-inner">
              <p className="kicker">Design · 3 sur 5</p>
              <h1 className="question">Quel type d’écriture&nbsp;?</h1>
              <p className="lead">Le ton de votre ebook. Chaque exemple dit la même chose, autrement.</p>
              <div className="flow-body">
                <div className="options">
                  <div className="option selected"><span className="title">Direct et pratique</span><span className="desc"><span className="quote">«&nbsp;Fermez votre boîte mail jusqu’à 11&nbsp;h. Voici comment tenir.&nbsp;»</span></span></div>
                  <div className="option"><span className="title">Chaleureux et personnel</span><span className="desc"><span className="quote">«&nbsp;Moi aussi, j’ai longtemps commencé mes journées par mes emails.&nbsp;»</span></span></div>
                  <div className="option"><span className="title">Expert et précis</span><span className="desc"><span className="quote">«&nbsp;Chaque interruption oblige à reconstruire son fil de pensée.&nbsp;»</span></span></div>
                  <div className="option"><span className="title">Inspirant</span><span className="desc"><span className="quote">«&nbsp;Et si la meilleure heure de votre journée vous appartenait à nouveau&nbsp;?&nbsp;»</span></span></div>
                </div>
                <div className="address"><span className="label">Vous parlez à votre lecteur en</span><div className="segmented"><span className="on">Vouvoiement</span><span>Tutoiement</span></div></div>
              </div>
              <div className="flow-actions">
                <Link to="/couleurs" className="arrow-link">Retour</Link>
                
                <Link to="/illustrations" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
