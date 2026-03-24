import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          300: "#5eead4",
          400: "#22d3ee",
          500: "#38bdf8",
          600: "#6366f1"
        }
      },
      fontFamily: {
        sans: ["Noto Sans TC", "Noto Sans JP", "Archivo", "sans-serif"],
        display: ["Archivo", "Noto Sans TC", "Noto Sans JP", "sans-serif"]
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 15% 20%, rgba(6,182,212,0.22), transparent 44%), radial-gradient(circle at 80% 10%, rgba(99,102,241,0.24), transparent 42%), linear-gradient(130deg, rgba(15,23,42,0.95), rgba(2,6,23,0.96))"
      },
      boxShadow: {
        soft: "0 22px 55px rgba(2, 6, 23, 0.42)"
      }
    }
  },
  plugins: []
};

export default config;
