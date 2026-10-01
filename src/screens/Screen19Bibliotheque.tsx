import { Link } from "react-router";
import "./Screen19Bibliotheque.css";

/* 19 · Bibliothèque (Ensuite) */
export default function Screen19Bibliotheque() {
  return (
    <div className="s-19-bibliotheque">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <nav className="menu" aria-label="Menu">
              <Link to="/bibliotheque" className="current">Bibliothèque</Link>
              <Link to="/kit-de-marque">Kit de marque</Link>
              <Link to="/compte">Compte</Link>
            </nav>
            <div className="user">
              <span className="quota">Formule Gratuite</span>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="content">
            <div className="head">
              <div>
                <p className="kicker">Bonjour Camille</p>
                <h1 className="h1">Votre bibliothèque.</h1>
              </div>
              <div className="usage">
                <div>
                  <p className="label">Formule Gratuite</p>
                  <div className="bar"><span style={{ width: "100%" }}></span></div>
                  <p className="hint" style={{ marginTop: "6px" }}>1 ebook sur 1</p>
                </div>
                <Link to="/compte" className="btn btn-secondary">Voir les formules</Link>
              </div>
            </div>
            <div className="shelf">
              <Link to="/votre-ebook" className="book">
                <span className="cover monograph"><span className="title" style={{ top: "26%" }}>La méthode focus</span><span className="rule" style={{ top: "62%" }}></span></span>
                <div className="meta"><span className="name">La méthode focus</span><span className="tag">Prêt</span></div>
                <p className="hint" style={{ marginTop: "4px" }}>Guide · 12 pages · 2 vidéos</p>
              </Link>
              <Link to="/compte" className="new">
                <svg className="icon plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                <span className="label">Nouvel ebook</span>
                <span className="hint">Passez en Starter pour créer 3 ebooks par mois.</span>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
