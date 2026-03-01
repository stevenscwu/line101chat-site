import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bdd1ff",
          300: "#92b3ff",
          400: "#5f88ff",
          500: "#385df5",
          600: "#2b45d1",
          700: "#2639a7",
          800: "#233286",
          900: "#212f6a"
        },
        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63"
        }
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Sora", "Manrope", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at 15% 10%, rgba(56,93,245,0.18), transparent 40%), radial-gradient(circle at 85% 15%, rgba(6,182,212,0.12), transparent 35%), linear-gradient(135deg, rgba(255,255,255,0.98), rgba(241,245,249,0.9))",
        "hero-grid-dark": "radial-gradient(circle at 15% 10%, rgba(96,165,250,0.22), transparent 40%), radial-gradient(circle at 85% 15%, rgba(34,211,238,0.16), transparent 35%), linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.95))"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
