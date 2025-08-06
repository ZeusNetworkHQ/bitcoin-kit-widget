import * as path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

import tsconfig from "./tsconfig.json";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills(),
    svgr(),
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
      insertTypesEntry: true,
      ...(process.env.NODE_ENV === "production" && {
        rollupTypes: true,
        compilerOptions: {
          paths: {
            ...tsconfig.compilerOptions.paths,

            // [NOTE] vite will not resolve internal packages, so we need resolve them manually
            "@zeus-network/client": ["../../client/dist/main"],
            "@zeus-network/client/errors": ["../../client/dist/errors"],
            "@zeus-network/bitcoin-wallet-adapter": [
              "../../bitcoin-wallet-adapter/dist/main",
            ],
          },
        },
      }),
    }),
    {
      name: "vite-plugin-use-client",
      generateBundle(_, bundle) {
        for (const [, file] of Object.entries(bundle)) {
          if (/\.jsx?$/.test(file.fileName) && file.type === "chunk") {
            file.code = `"use client";\n${file.code}`;
          }
        }
      },
    },
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
        bitcoin: path.resolve(__dirname, "src/bitcoin.ts"),
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
