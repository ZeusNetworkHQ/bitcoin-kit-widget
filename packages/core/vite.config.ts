import * as path from "path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
  resolve: {
    alias: {
      ["@"]: path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        main: path.resolve(__dirname, "src/main.ts"),
        errors: path.resolve(__dirname, "src/errors/index.ts"),
      },
      formats: ["es"],
    },
  },
});
