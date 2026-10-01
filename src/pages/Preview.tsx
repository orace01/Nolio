import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ScaledFrame } from "../components/ScaledFrame";
import { DEVICES, type DeviceName } from "../devices";
import { SCREENS } from "../screens";
import { SITE_PAGES } from "../sitePages";

const PAGES = [...SITE_PAGES, ...SCREENS];
import "../styles/board.css";

/* Un écran à la taille exacte d'un appareil, réduit si la fenêtre est trop petite */
export default function Preview() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const index = Math.max(0, PAGES.findIndex((screen) => screen.path === params.get("page")));
  const screen = PAGES[index];
  const requested = params.get("device") ?? "";
  const device: DeviceName = requested in DEVICES ? (requested as DeviceName) : "mobile";
  const { label, width, height } = DEVICES[device];
  const url = (target: number, name: DeviceName = device) =>
    `/parcours/apercu?page=${encodeURIComponent(PAGES[target].path)}&device=${name}`;

  useEffect(() => {
    document.title = `Nolio · Aperçu · ${screen.title}`;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && PAGES[index + 1]) navigate(url(index + 1));
      if (event.key === "ArrowLeft" && PAGES[index - 1]) navigate(url(index - 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="device-preview">
      <nav className="device-preview-bar" aria-label="Aperçu responsive">
        <span className="where">
          {screen.title} · {label} {width} × {height}
        </span>
        <span className="devices">
          {(Object.keys(DEVICES) as DeviceName[]).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === device}
              onClick={() => setParams({ page: screen.path, device: name }, { replace: true })}
            >
              {DEVICES[name].label}
            </button>
          ))}
        </span>
        {index > 0 ? <Link to={url(index - 1)}>Précédent</Link> : <a aria-disabled="true">Précédent</a>}
        <Link to="/parcours">Parcours</Link>
        {index < PAGES.length - 1 ? <Link to={url(index + 1)}>Suivant</Link> : <a aria-disabled="true">Suivant</a>}
        <a href={screen.path} target="_blank" rel="noopener">
          Ouvrir seul
        </a>
      </nav>
      <ScaledFrame
        key={`${screen.path}-${device}`}
        className="device-preview-frame"
        src={screen.path}
        title={`${screen.title} · ${label}`}
        width={width}
        height={height}
        fit="contain"
      />
    </div>
  );
}
