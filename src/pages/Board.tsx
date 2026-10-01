import { Link } from "react-router";
import { ScaledFrame } from "../components/ScaledFrame";
import { DEVICES, type DeviceName } from "../devices";
import { SCREENS } from "../screens";
import { SITE_PAGES } from "../sitePages";
import "../styles/board.css";

/* Le site d'abord, puis les écrans de l'application */
const PAGES = [...SITE_PAGES, ...SCREENS];
const GROUPS = [...new Set(PAGES.map((page) => page.group))];
const previewUrl = (screen: { path: string }, device: DeviceName) => `/parcours/apercu?page=${encodeURIComponent(screen.path)}&device=${device}`;

/* La planche : chaque écran en version PC et en version mobile, côte à côte */
export default function Board() {
  return (
    <main className="board">
      <header className="board-intro">
        <div>
          <p className="kicker">Maquette de l’application</p>
          <h1 className="h1">Parcours utilisateur.</h1>
          <p className="lead">
            Vingt-deux écrans, une chose par page, de la connexion au téléchargement de l’ebook, avec l’exemple de
            Camille Martin et de «&nbsp;La méthode focus&nbsp;». Chaque page est montrée en version PC et en version
            mobile. Cliquez sur la version PC pour l’ouvrir, ou sur la version mobile pour la tester à la taille d’un
            téléphone.
          </p>
        </div>
        <Link className="btn btn-primary" to={SCREENS[0].path}>
          Parcourir la maquette
        </Link>
      </header>

      {GROUPS.map((group) => {
        const items = PAGES.filter((page) => page.group === group);
        return (
          <section key={group} className="board-group">
            <div className="board-group-title">
              <h2 className="h2">{group}</h2>
              <span className="small muted">{items.length} écrans</span>
            </div>
            <div className="board-screens">
              {items.map((screen) => (
                <div key={screen.path} className="board-screen">
                  <div className="board-pair">
                    {(["pc", "mobile"] as const).map((device) => (
                      <Link
                        key={device}
                        to={device === "pc" ? screen.path : previewUrl(screen, device)}
                        className={`board-thumb ${device}`}
                        title={`${screen.title} · ${DEVICES[device].label}`}
                      >
                        <ScaledFrame
                          src={screen.path}
                          title={`${screen.title} · ${DEVICES[device].label}`}
                          width={DEVICES[device].width}
                          height={DEVICES[device].height}
                          fit="width"
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="board-caption">
                    <span className="n textured">{screen.id}</span>
                    <span className="t">{screen.title}</span>
                    <span className="small muted devices">PC 1440 · Mobile 390</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
