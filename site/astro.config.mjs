import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://jcamille.dev",
  output: "static",
  build: { format: "file" },
});
