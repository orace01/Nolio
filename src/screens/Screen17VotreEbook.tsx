import { Link } from "react-router";
import "./Screen17VotreEbook.css";

/* 17 · Votre ebook (5. Votre ebook) */
export default function Screen17VotreEbook() {
  return (
    <div className="s-17-votre-ebook">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <ol className="stepper" aria-label="Étapes de création">
              <li className="done"><span className="n">1</span><span className="name">Votre idée</span></li>
              <li className="done"><span className="n">2</span><span className="name">Précisions</span></li>
              <li className="done"><span className="n">3</span><span className="name">Design</span></li>
              <li className="done"><span className="n">4</span><span className="name">Validation</span></li>
              <li className="current"><span className="n">5</span><span className="name">Votre ebook</span></li>
            </ol>
            <div className="user" style={{ marginLeft: "0" }}>
              <Link to="/bibliotheque" className="save">Enregistrer et quitter</Link>
              <span className="avatar">CM</span>
            </div>
          </header>
          <div className="body">
            <section className="viewer">
              <div className="turn">
                <svg viewBox="0 0 40 10" aria-hidden="true" style={{ transform: "scaleX(-1)" }}><line x1="0" y1="5" x2="39" y2="5" /><polyline points="34,1 39.2,5 34,9" /></svg>
                <span>Pages 4 et 5 sur 12</span>
                <svg viewBox="0 0 40 10" aria-hidden="true"><line x1="0" y1="5" x2="39" y2="5" /><polyline points="34,1 39.2,5 34,9" /></svg>
              </div>
              <div className="spread">
                <div className="pg">
                  <span className="run">La méthode focus</span>
                  <svg className="icon-art" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  <p className="opener-number textured" style={{ fontSize: "3.4em" }}>02</p>
                  <p className="opener-title">Rituel 1&nbsp;: la page du matin</p>
                  <div className="opener-rule"></div>
                  <p>Avant d’ouvrir vos emails, prenez dix minutes pour écrire ce qui compte vraiment aujourd’hui.</p>
                  <span className="folio">4</span>
                </div>
                <div className="pg">
                  <span className="run">Rituel 1</span>
                  <p>La plupart des indépendants commencent leur journée par leur boîte de réception, et répondent aux priorités des autres avant les leurs.</p>
                  <div className="video commented"><span className="play"></span><div><p className="video-kind">Vidéo · 4 min</p><p className="video-name">La page du matin, en pratique</p></div><svg className="qr" viewBox="0 0 7 7" aria-hidden="true"><path d="M0 0h3v3H0zM1 1v1h1V1zM4 0h3v3H4zM5 1v1h1V1zM0 4h3v3H0zM1 5v1h1V5zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z" fillRule="evenodd" /></svg></div>
                  <ul className="checklist">
                    <li>Écrire avant d’ouvrir l’ordinateur</li>
                    <li>Trois phrases au maximum</li>
                    <li>Relire la page à midi</li>
                  </ul>
                  <span className="folio">5</span>
                </div>
              </div>
              <div className="strip" aria-label="Pages"><span className="">1</span><span className="">2</span><span className="">3</span><span className="on">4</span><span className="on">5</span><span className="">6</span><span className="">7</span><span className="">8</span><span className="">9</span><span className="">10</span><span className="">11</span><span className="">12</span></div>
            </section>
      
            <aside className="comments">
              <div>
                <p className="kicker">Vos commentaires</p>
                <p className="small muted" style={{ marginTop: "8px" }}>Cliquez sur un passage ou une page, puis dites ce qu’il faut corriger. Nolio s’en charge.</p>
              </div>
              <div className="comment done"><p className="where"><span>Page 2</span><span>Corrigé</span></p><p className="text">Raccourcis l’introduction, trois phrases suffisent.</p></div>
              <div className="comment"><p className="where"><span>Page 5 · la vidéo</span><span>En attente</span></p><p className="text">Remplace la vidéo par la version courte, de 2 minutes.</p></div>
              <textarea className="textarea" style={{ minHeight: "72px" }} placeholder="Votre commentaire sur la page 5" defaultValue={""} />
              <span className="btn btn-secondary btn-small" style={{ alignSelf: "flex-start" }}>Ajouter le commentaire</span>
              <div className="final">
                <span className="btn btn-secondary">Appliquer les corrections (1)</span>
                <Link to="/telechargement" className="btn btn-primary">Télécharger la version finale</Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
