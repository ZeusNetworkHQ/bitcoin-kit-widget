import * as path from "path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills(),
    dts({
      insertTypesEntry: true,
      entryRoot: path.resolve(__dirname, "src"),
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
