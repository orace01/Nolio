import { Link } from "react-router";
import "./Screen00Connexion.css";

/* 00 · Connexion (Accueil) */
export default function Screen00Connexion() {
  return (
    <div className="s-00-connexion">
      <div className="stage">
        <div className="app split">
          <div className="photo">
            <span className="brand">Nolio.</span>
            <div className="side">
              <p>Votre expertise, reliée en</p>
              <p>Vrai livre.</p>
            </div>
          </div>
      
          <div className="panel-form">
            <p className="kicker">Connexion</p>
            <h1 className="h1">Content de vous revoir.</h1>
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="field">
                <label className="label" htmlFor="email">Adresse email</label>
                <input className="input" id="email" type="email" defaultValue="camille.martin@exemple.com" />
              </div>
              <div className="field">
                <label className="label" htmlFor="password">Mot de passe</label>
                <input className="input" id="password" type="password" defaultValue="motdepasse" />
              </div>
              <a className="forgot" href="#">Mot de passe oublié&nbsp;?</a>
              <div>
                <Link to="/bienvenue" className="btn btn-primary">Se connecter</Link>
              </div>
            </form>
            <p className="alt">Pas encore de compte&nbsp;? <a href="#">Créer un compte</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
