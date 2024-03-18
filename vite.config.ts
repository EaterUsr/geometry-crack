import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";

export default defineConfig({
  plugins: [tsconfigPaths()],
  base: "./",
  css: {
    postcss: {
      plugins: [postcssImport, postcssNested, autoprefixer],
    },
  },
});
