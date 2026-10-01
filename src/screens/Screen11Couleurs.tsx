import { Link } from "react-router";
import "./Screen11Couleurs.css";

/* 11 · Couleurs et police (3. Design) */
export default function Screen11Couleurs() {
  return (
    <div className="s-11-couleurs">
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
            <div className="flow-inner wide">
              <p className="kicker">Design · 2 sur 5</p>
              <h1 className="question">Vos couleurs et votre police.</h1>
              <p className="lead">Chaque thème associe une couleur et un duo de polices, pour les titres et pour le texte.</p>
              <div className="flow-body">
                <div className="options three">
                  <div className="option selected theme"><div className="preview"><div className="swatches"><span style={{ background: "#2a3f34" }}></span><span style={{ background: "#d8cfc0" }}></span><span style={{ background: "#f4f3ef" }}></span></div><p className="sample-title" style={{ fontFamily: "Montserrat", fontWeight: "700", textTransform: "uppercase", color: "#2a3f34" }}>La méthode focus</p><p className="sample-body" style={{ fontFamily: "'Source Serif 4'" }}>Cinq rituels pour travailler moins et mieux.</p></div><span className="title">Forêt <span className="tag tag-ok">Basique</span></span><span className="desc">Vert profond · Montserrat et Source Serif</span></div>
                  <div className="option theme"><div className="preview"><div className="swatches"><span style={{ background: "#243a5e" }}></span><span style={{ background: "#c9d3e3" }}></span><span style={{ background: "#f4f3ef" }}></span></div><p className="sample-title" style={{ fontFamily: "Fraunces", fontWeight: "600", color: "#243a5e" }}>La méthode focus</p><p className="sample-body" style={{ fontFamily: "Inter" }}>Cinq rituels pour travailler moins et mieux.</p></div><span className="title">Nuit <span className="tag tag-ok">Basique</span></span><span className="desc">Bleu nuit · Fraunces et Inter</span></div>
                  <div className="option theme"><div className="preview"><div className="swatches"><span style={{ background: "#9a7426" }}></span><span style={{ background: "#eadfc8" }}></span><span style={{ background: "#f7f3ea" }}></span></div><p className="sample-title" style={{ fontFamily: "Montserrat", fontWeight: "700", color: "#9a7426" }}>La méthode focus</p><p className="sample-body" style={{ fontFamily: "Lato" }}>Cinq rituels pour travailler moins et mieux.</p></div><span className="title">Sable <span className="tag tag-ok">Basique</span></span><span className="desc">Ocre · Montserrat et Lato</span></div>
                  <div className="option theme"><div className="preview"><div className="swatches"><span style={{ background: "#a4553a" }}></span><span style={{ background: "#f0d9cc" }}></span><span style={{ background: "#f7f2ec" }}></span></div><p className="sample-title" style={{ fontFamily: "'Playfair Display'", fontWeight: "600", color: "#a4553a" }}>La méthode focus</p><p className="sample-body" style={{ fontFamily: "Lato" }}>Cinq rituels pour travailler moins et mieux.</p></div><span className="title">Terre <span className="tag">Premium</span></span><span className="desc">Terracotta · Playfair Display et Lato</span></div>
                  <div className="option theme"><div className="preview"><div className="swatches"><span style={{ background: "#1d1d1d" }}></span><span style={{ background: "#d9d9d6" }}></span><span style={{ background: "#f4f3ef" }}></span></div><p className="sample-title" style={{ fontFamily: "'DM Serif Display'", color: "#1d1d1d" }}>La méthode focus</p><p className="sample-body" style={{ fontFamily: "'DM Sans'" }}>Cinq rituels pour travailler moins et mieux.</p></div><span className="title">Encre <span className="tag">Premium</span></span><span className="desc">Noir profond · DM Serif Display et DM Sans</span></div>
                  <div className="option theme custom"><div className="preview">+</div><span className="title">Vos couleurs <span className="tag tag-pro">Pro</span></span><span className="desc">Choisissez votre couleur d’accent et vos polices.</span></div>
                </div>
              </div>
              <div className="flow-actions">
                <Link to="/style" className="arrow-link">Retour</Link>
                
                <Link to="/ecriture" className="btn btn-primary">Continuer</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
