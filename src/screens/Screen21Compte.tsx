import { Link } from "react-router";
import "./Screen21Compte.css";

/* 21 · Compte et abonnement (Ensuite) */
export default function Screen21Compte() {
  return (
    <div className="s-21-compte">
      <div className="stage">
        <div className="app">
          <header className="topbar">
            <span className="logo">Nolio.</span>
            <nav className="menu" aria-label="Menu">
              <Link to="/bibliotheque">Bibliothèque</Link>
              <Link to="/kit-de-marque">Kit de marque</Link>
              <Link to="/compte" className="current">Compte</Link>
            </nav>
            <div className="user">
              <span className="quota">Formule Gratuite</span>
              <span className="avatar">CM</span>
            </div>
          </header>
          <main className="content">
            <div>
              <p className="kicker">Compte</p>
              <h1 className="h1">Votre formule.</h1>
            </div>
            <nav className="tabs" aria-label="Rubriques du compte"><span>Profil</span><span className="on">Formule</span><span>Factures</span></nav>
            <div className="plans">
              <section className="plan panel">
                <div className="plan-head"><h2 className="h2">Gratuit</h2><span className="tag">Actuelle</span></div>
                <p className="price"><b>0 €</b></p>
                <ul className="perks"><li><span className="check"></span>1 ebook, jusqu’à 15 pages</li><li><span className="check"></span>Styles et thèmes Basiques</li><li><span className="check"></span>PDF interactif, avec mention Nolio</li></ul>
              </section>
              <section className="plan panel">
                <div className="plan-head"><h2 className="h2">Starter</h2></div>
                <p className="price"><b>12 €</b> <span className="small muted">par mois</span></p>
                <ul className="perks"><li><span className="check"></span>3 ebooks par mois, jusqu’à 40 pages</li><li><span className="check"></span>Tous les styles Premium</li><li><span className="check"></span>PDF à imprimer, sans mention</li></ul>
                <span className="btn btn-secondary">Choisir Starter</span>
              </section>
              <section className="plan pro">
                <div className="plan-head"><h2 className="h2">Pro</h2><span className="tag tag-pro">Le plus complet</span></div>
                <p className="price"><b>29 €</b> <span className="small muted">par mois</span></p>
                <ul className="perks"><li><span className="check"></span>10 ebooks par mois, jusqu’à 120 pages</li><li><span className="check"></span>Votre propre style</li><li><span className="check"></span>Images générées par IA</li><li><span className="check"></span>EPUB</li></ul>
                <span className="btn btn-primary">Choisir Pro</span>
              </section>
            </div>
            <p className="hint">Annuel&nbsp;: 2 mois offerts sur chaque formule. Aucune facture pour l’instant.</p>
          </main>
        </div>
      </div>
    </div>
  );
}
