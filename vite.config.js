import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({

  base: "./",

  resolve: {
    alias: {
      app: src("app"),
      styles: src("styles")
    }
  },

  build: {
    outDir: "dist",
    target: "es2020",
    cssMinify: "lightningcss"
  },

  css: {
    // Remplace toute la chaîne postcss-preset-env / postcss-normalize :
    // lightningcss lit les cibles depuis le champ browserslist du package.json
    // et abaisse notamment l'imbrication CSS utilisée dans global.css.
    transformer: "lightningcss"
  },

  test: {
    environment: "node",
    include: ["test/**/*.test.js"]
  }
});
