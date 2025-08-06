import * as path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
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
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "@solana/wallet-adapter-react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.names.some((name) => name.endsWith(".css"))) {
            return "assets/style.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
