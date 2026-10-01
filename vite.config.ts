import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@/..." points into the site sources
    alias: [{ find: /^@\/(.*)$/, replacement: `${fileURLToPath(new URL("./src/site/", import.meta.url))}$1` }],
  },
  // Port dédié : 5173 est déjà utilisé par d'autres projets sur ce poste
  server: { port: 5190, strictPort: true },
  preview: { port: 5191, strictPort: true },
});
