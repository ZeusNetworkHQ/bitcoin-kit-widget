import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

import baseEslintConfig from "./base.eslint.config.js";

export default tseslint.config([
  baseEslintConfig,
  [
    {
      files: ["**/*.{ts,tsx}"],
      extends: [
        eslintReact.configs["recommended-typescript"],
        reactHooks.configs["recommended-latest"],
        reactRefresh.configs.vite,
      ],
      rules: {
        "@eslint-react/no-missing-key": "warn",
        "react-refresh/only-export-components": "off",
      },
    },
  ],
]);
