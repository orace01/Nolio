/* Tailles d'écran de référence pour les versions responsives */
export const DEVICES = {
  pc: { label: "PC", width: 1440, height: 900 },
  tablette: { label: "Tablette", width: 768, height: 1024 },
  mobile: { label: "Mobile", width: 390, height: 844 },
} as const;

export type DeviceName = keyof typeof DEVICES;
