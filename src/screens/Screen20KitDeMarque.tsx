import { Link } from "react-router";
import "./Screen20KitDeMarque.css";

/* 20 · Kit de marque (Ensuite) */
export default function Screen20KitDeMarque() {
  return (
    <div className="s-20-kit-de-marque">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <nav className="menu" aria-label="Menu">
              <Link to="/bibliotheque">Bibliothèque</Link>
              <Link to="/kit-de-marque" className="current">Kit de marque</Link>
              <Link to="/compte">Compte</Link>
            </nav>
            <div className="user">
              <span className="quota">Formule Gratuite</span>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="content">
            <section className="form">
              <div>
                <p className="kicker">Kit de marque</p>
                <h1 className="h1">Votre marque, dans chaque ebook.</h1>
                <p className="lead" style={{ maxWidth: "640px" }}>Réglé une fois, appliqué à tous vos ebooks&nbsp;: couverture, page «&nbsp;À propos&nbsp;» et appel à l’action.</p>
              </div>
              <div className="row">
                <div className="field"><span className="label">Logo</span><div className="upload"><span className="monogram">CM</span><span className="small">Remplacer le logo<br /><span className="hint">PNG ou SVG, fond transparent</span></span></div></div>
                <div className="field"><span className="label">Votre photo</span><div className="upload"><span className="portrait"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="8" /><path d="M4 40c0-9 7-15 16-15s16 6 16 15z" /></svg></span><span className="small">Importer une photo<br /><span className="hint">Carrée, au moins 800 px</span></span></div></div>
              </div>
              <div className="field">
                <span className="label">Couleurs de marque</span>
                <div className="swatches">
                  <span className="swatch"><span style={{ background: "#2a3f34" }}></span>Vert</span>
                  <span className="swatch"><span style={{ background: "#d8cfc0" }}></span>Sable</span>
                  <span className="swatch"><span style={{ background: "#a4553a" }}></span>Terracotta</span>
                  <span className="swatch add"><span>+</span>Ajouter</span>
                </div>
                <span className="hint">Proposées à côté des thèmes de couleurs lors du design.</span>
              </div>
              <div className="field">
                <label className="label" htmlFor="bio">Bio courte</label>
                <textarea className="textarea" id="bio" style={{ minHeight: "76px" }} defaultValue={"Coach en productivité depuis 2020, j’aide les indépendants à retrouver du temps pour le travail qui compte, sans applications ni méthode rigide."} />
              </div>
              <div className="row">
                <div className="field"><label className="label" htmlFor="cta">Appel à l’action par défaut</label><input className="input" id="cta" defaultValue="Réservez un appel découverte" /></div>
                <div className="field"><label className="label" htmlFor="link">Lien</label><input className="input" id="link" defaultValue="https://exemple.com/rendez-vous" /></div>
              </div>
            </section>
            <aside className="preview">
              <p className="kicker">Aperçu&nbsp;: dernière page</p>
              <div className="pg">
                <span className="run">À propos de l’autrice</span>
                <span className="about-photo"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="8" /><path d="M4 40c0-9 7-15 16-15s16 6 16 15z" /></svg></span>
                <p className="about-name">Camille Martin</p>
                <div className="opener-rule"></div>
                <p>Coach en productivité depuis 2020, j’aide les indépendants à retrouver du temps pour le travail qui compte, sans applications ni méthode rigide.</p>
                <div className="cta"><p>Réservez un appel découverte</p></div>
                <span className="folio">12</span>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
