import { Link } from "react-router";
import "./Screen10OptionPremium.css";

/* 10 · Option Premium (3. Design) */
export default function Screen10OptionPremium() {
  return (
    <div className="s-10-option-premium">
      <iframe className="behind" src="/style" title="Choix du style" tabIndex={-1}></iframe>
      <div className="veil"></div>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="premium-title">
        <div className="visual"><span className="cover studio"><span className="big">05</span><span className="title">La méthode focus</span></span></div>
        <div className="body">
          <Link to="/style" className="close">Fermer</Link>
          <p className="kicker">Style Premium</p>
          <h1 className="h1" id="premium-title" style={{ fontSize: "26px" }}>Studio fait partie des styles Premium.</h1>
          <p className="small">Les styles Premium sont inclus dans les formules Starter et Pro. Vous pouvez aussi continuer avec un style Basique et changer plus tard.</p>
          <div className="plans">
            <div className="plan"><span className="label">Starter</span><p><b>12 €</b> <span className="small muted">par mois</span></p><ul><li>Tous les styles Premium</li><li>3 ebooks par mois</li><li>Jusqu’à 40 pages</li></ul></div>
            <div className="plan"><span className="label">Pro</span><p><b>29 €</b> <span className="small muted">par mois</span></p><ul><li>Votre propre style</li><li>Images générées par IA</li><li>10 ebooks par mois</li></ul></div>
          </div>
          <div className="actions">
            <Link to="/couleurs" className="btn btn-primary">Choisir Starter</Link>
            <Link to="/couleurs" className="btn btn-secondary">Choisir Pro</Link>
            <Link to="/couleurs" className="arrow-link">Rester en Gratuit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
