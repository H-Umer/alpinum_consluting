// tailwind.config.js or tailwind.config.ts (Next.js supports both)

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // Component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
