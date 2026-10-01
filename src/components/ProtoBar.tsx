import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { SCREENS } from "../screens";

const pad = (value: number) => String(value).padStart(2, "0");

/* Dans la planche et l'aperçu, les écrans sont affichés sans cette barre */
export const isEmbedded = typeof window !== "undefined" && window.self !== window.top;

/* Barre sous la carte : précédent, parcours, suivant, et les flèches du clavier */
export function ProtoBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const index = SCREENS.findIndex((screen) => screen.path === pathname);
  const previous = SCREENS[index - 1];
  const next = SCREENS[index + 1];

  useEffect(() => {
    if (isEmbedded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, select")) return;
      if (event.key === "ArrowRight" && next) navigate(next.path);
      if (event.key === "ArrowLeft" && previous) navigate(previous.path);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, next, previous]);

  if (isEmbedded || index < 0) return null;

  return (
    <nav className="proto" aria-label="Navigation de la maquette">
      <span className="where">
        Maquette {pad(index)} / {pad(SCREENS.length - 1)} : {SCREENS[index].title}
      </span>
      {previous ? <Link to={previous.path}>Précédent</Link> : <a aria-disabled="true">Précédent</a>}
      <Link to="/parcours">Parcours</Link>
      {next ? <Link to={next.path}>Suivant</Link> : <a aria-disabled="true">Suivant</a>}
    </nav>
  );
}
