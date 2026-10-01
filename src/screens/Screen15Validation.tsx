import { Link } from "react-router";
import "./Screen15Validation.css";

/* 15 · Validation (4. Validation) */
export default function Screen15Validation() {
  return (
    <div className="s-15-validation">
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
            <div className="flow-inner wide">
              <p className="kicker">Validation</p>
              <h1 className="question">Tout est prêt. On valide&nbsp;?</h1>
              <p className="lead">Voici le sommaire prévu et un aperçu de votre style. Vous pourrez encore commenter l’ebook une fois créé.</p>
              <div className="flow-body">
                <div className="two">
                  <section>
                    <p className="label">Sommaire prévu · 12 pages</p>
                    <ol className="outline" style={{ marginTop: "10px" }}>
                      <li><span className="n">01</span><span>Pourquoi vos journées vous échappent</span><span className="meta">p. 2</span></li>
                      <li><span className="n">02</span><span>Rituel 1&nbsp;: la page du matin</span><span className="meta"><span className="mini-video" aria-label="Vidéo"></span>p. 4</span></li>
                      <li><span className="n">03</span><span>Rituel 2&nbsp;: les trois priorités</span><span className="meta"><span className="mini-video" aria-label="Vidéo"></span>p. 6</span></li>
                      <li><span className="n">04</span><span>Rituel 3&nbsp;: l’email en deux passages</span><span className="meta">p. 8</span></li>
                      <li><span className="n">05</span><span>Rituel 4&nbsp;: les blocs de concentration</span><span className="meta">p. 9</span></li>
                      <li><span className="n">06</span><span>Rituel 5&nbsp;: la revue du vendredi</span><span className="meta">p. 10</span></li>
                      <li><span className="n">07</span><span>Votre plan sur 30 jours</span><span className="meta">p. 11</span></li>
                      <li><span className="n">08</span><span>Réservons un appel</span><span className="meta"><span className="label" style={{ fontSize: "9px" }}>Lien</span>p. 12</span></li>
                    </ol>
                  </section>
                  <section>
                    <p className="label">Aperçu du style</p>
                    <div className="look" style={{ marginTop: "10px" }}>
                      <span className="cover monograph"><span className="title" style={{ top: "26%", fontSize: "17px" }}>La méthode focus</span><span className="rule" style={{ top: "60%" }}></span></span>
                      <div className="pg">
                        <span className="run">Rituel 1</span>
                        <p className="opener-title" style={{ marginTop: "0" }}>La page du matin</p>
                        <div className="opener-rule"></div>
                        <p>Avant d’ouvrir vos emails, prenez dix minutes pour écrire ce qui compte vraiment aujourd’hui.</p>
                        <div className="video"><span className="play"></span><div><p className="video-kind">Vidéo · 4 min</p><p className="video-name">La page du matin</p></div><svg className="qr" viewBox="0 0 7 7" aria-hidden="true"><path d="M0 0h3v3H0zM1 1v1h1V1zM4 0h3v3H4zM5 1v1h1V1zM0 4h3v3H0zM1 5v1h1V5zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z" fillRule="evenodd" /></svg></div>
                        <span className="folio">4</span>
                      </div>
                    </div>
                    <dl className="choices">
                      <div><dt>Style</dt><dd>Monographie</dd></div>
                      <div><dt>Couleurs</dt><dd>Forêt</dd></div>
                      <div><dt>Écriture</dt><dd>Direct et pratique</dd></div>
                      <div><dt>Illustrations</dt><dd>Icônes</dd></div>
                    </dl>
                  </section>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/images" className="arrow-link">Retour</Link>
                
                <Link to="/creation" className="btn btn-primary">Valider et créer mon ebook</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
