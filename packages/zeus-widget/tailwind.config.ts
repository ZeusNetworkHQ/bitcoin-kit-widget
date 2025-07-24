import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: ["./src/components/**/*.{ts,tsx}"],
  theme: {},
  prefix: "zeus",
} satisfies Config;

export default config;
