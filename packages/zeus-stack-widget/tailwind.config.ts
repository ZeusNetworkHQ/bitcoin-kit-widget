/* eslint-disable @typescript-eslint/no-require-imports */

import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {},
  prefix: "zeus",
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
