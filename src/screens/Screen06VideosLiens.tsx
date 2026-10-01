import { Link } from "react-router";
import "./Screen06VideosLiens.css";

/* 06 · Vidéos et liens (2. Précisions) */
export default function Screen06VideosLiens() {
  return (
    <div className="s-06-videos-liens">
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
              <p className="kicker">Précision 2 sur 3</p>
              <h1 className="question">Vos vidéos et vos liens.</h1>
              <p className="lead">Ils deviendront cliquables dans votre ebook, avec un aperçu et un QR code pour ceux qui l’impriment.</p>
              <div className="flow-body">
                <ul className="media">
                  <li><span className="vthumb" aria-hidden="true"></span><div><p className="t">Rituel 1&nbsp;: la page du matin</p><p className="hint">Vidéo YouTube · 4 min</p></div><span className="remove">Retirer</span></li>
                  <li><span className="vthumb" aria-hidden="true"></span><div><p className="t">Rituel 2&nbsp;: les trois priorités</p><p className="hint">Vidéo YouTube · 3 min</p></div><span className="remove">Retirer</span></li>
                  <li><svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1 M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" /></svg><div><p className="t">Réserver un appel découverte</p><p className="hint">Lien, placé en dernière page</p></div><span className="remove">Retirer</span></li>
                </ul>
                <div className="add">
                  <input className="input" placeholder="Collez le lien d’une vidéo ou d’une page web" />
                  <span className="btn btn-secondary">Ajouter</span>
                </div>
                <p className="hint files" style={{ marginTop: "14px" }}>Des fichiers à joindre&nbsp;? <a href="#">Importer un PDF ou des images</a></p>
              </div>
              <div className="flow-actions">
                <Link to="/pour-qui" className="arrow-link">Retour</Link>
                
                <Link to="/longueur" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
