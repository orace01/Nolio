import Image from "next/image";
import leaves from "@/assets/hero/hero-leaves.jpg";

/*
 * Illustrations drawn in the ebook pages: line icons, line drawings, flat
 * shapes, photos and a QR code. All are decorative; the text carries the
 * meaning.
 */

const ICONS = [
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
  <>
    <rect x="4" y="4" width="16" height="16" />
    <path d="M8 12l3 3 5-6" />
  </>,
  <>
    <rect x="3" y="6" width="18" height="12" />
    <path d="M3 7l9 6 9-6" />
  </>,
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </>,
  <>
    <rect x="4" y="5" width="16" height="15" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </>,
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
  </>,
  <>
    <path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z" />
  </>,
  <>
    <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" />
  </>,
];

export function LineIcon({ index, className }: { index: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[index % ICONS.length]}
    </svg>
  );
}

const DRAWINGS = [
  // A desk by the window
  <>
    <path d="M8 64h104M20 64l10-18h34l10 18M34 46h26M82 64V52h16v12M98 55c6 0 6 7 0 7M86 48c0-4 4-4 4-8M92 48c0-4 4-4 4-8" />
    <rect x="14" y="8" width="44" height="28" />
    <path d="M14 29c9-7 17-7 26 0s12 6 18 1" />
    <circle cx="46" cy="18" r="5" />
  </>,
  // A window and a plant
  <>
    <rect x="20" y="6" width="40" height="46" />
    <path d="M40 6v46M20 29h40M8 64h104M78 64h26l-3-16H81zM91 48c0-10-8-14-12-22M91 48c0-9 6-15 12-20M91 48V30" />
  </>,
  // Hills and a sun
  <>
    <path d="M6 62l28-34 18 20 14-14 28 28M6 64h108" />
    <circle cx="92" cy="18" r="8" />
  </>,
  // A cup and a notebook
  <>
    <path d="M18 30h30v22a10 10 0 0 1-10 10h-10a10 10 0 0 1-10-10zM48 36h5a6 6 0 0 1 0 12h-5M28 22c0-4 4-4 4-8M38 22c0-4 4-4 4-8" />
    <path d="M66 26l40-6 6 38-40 6zM76 34l24-4M78 42l24-4M80 50l16-2" />
  </>,
];

export function Drawing({ index, className }: { index: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 70" aria-hidden="true">
      {DRAWINGS[index % DRAWINGS.length]}
    </svg>
  );
}

/* Flat shapes in the theme colors: the accent, its tint and a mid tone */
export function Shapes({ index, className }: { index: number; className?: string }) {
  const accent = "var(--accent)";
  const soft = "var(--soft)";
  const mid = "color-mix(in srgb, var(--accent) 45%, var(--soft))";
  const layouts = [
    <>
      <circle cx="30" cy="30" r="18" fill={accent} />
      <rect x="52" y="14" width="30" height="30" fill={mid} />
      <path d="M92 46l14-30 14 30z" fill={soft} />
    </>,
    <>
      <path d="M10 50a30 30 0 0 1 60 0z" fill={accent} />
      <rect x="78" y="20" width="22" height="22" fill={soft} />
      <circle cx="104" cy="16" r="8" fill={mid} />
    </>,
    <>
      <circle cx="40" cy="30" r="20" fill={soft} />
      <circle cx="62" cy="30" r="20" fill={mid} />
      <rect x="86" y="10" width="26" height="40" fill={accent} />
    </>,
  ];
  return (
    <svg className={className} viewBox="0 0 120 60" aria-hidden="true">
      {layouts[index % layouts.length]}
    </svg>
  );
}

/* Where the hero photograph is cropped, so repeated photos differ */
const CROPS = ["30% 60%", "70% 30%", "50% 85%", "15% 20%", "85% 70%"];

type PhotoProps = {
  /* An imported photo as a data URL, or the default photograph */
  src?: string;
  index: number;
  sizes: string;
  eager?: boolean;
  className?: string;
};

export function Photo({ src, index, sizes, eager = false, className }: PhotoProps) {
  return (
    <Image
      src={src ?? leaves}
      alt=""
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={className}
      style={{ objectFit: "cover", objectPosition: src ? "center" : CROPS[index % CROPS.length] }}
    />
  );
}

/* Placeholder for a portrait not imported yet */
export function Silhouette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="15" r="8" />
      <path d="M4 40c0-9 7-15 16-15s16 6 16 15z" />
    </svg>
  );
}

/* A stable number from a string, to vary the pattern of each code */
function seed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const qrCache = new Map<string, string>();

/* Modules of a 21 × 21 code: three finder squares, then a pattern drawn from the link */
function qrPath(value: string) {
  const cached = qrCache.get(value);
  if (cached) return cached;

  let state = seed(value) || 1;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };

  const inFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
  let path = "";
  for (const [x, y] of [
    [0, 0],
    [14, 0],
    [0, 14],
  ]) {
    path += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  }
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      if (inFinder(x, y)) continue;
      const timing = (x === 6 || y === 6) && (x + y) % 2 === 0;
      if (timing || (x !== 6 && y !== 6 && random() < 0.5)) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  qrCache.set(value, path);
  return path;
}

// TODO: encode a real, scannable QR code for the print version
export function QrCode({ value, className }: { value: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21" aria-hidden="true" shapeRendering="crispEdges">
      <path d={qrPath(value)} fillRule="evenodd" />
    </svg>
  );
}
