import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: "#fdf2f4",
          100: "#fce7ea",
          200: "#f9d0d6",
          300: "#f4aab6",
          400: "#eb778d",
          500: "#dc4664",
          600: "#be2546",
          700: "#9f1b36",
          800: "#841a31",
          900: "#701a2d",
          950: "#3f0914",
          brand: "#7B1123",
          hover: "#620C1B",
        },
        academic: {
          border: "#E2E8F0",
          card: "#FFFFFF",
          muted: "#64748B",
          heading: "#1E293B",
          darkred: "#4A1521",
          surface: "#F8FAFC",
        },
        accent: {
          purple: "#6366F1",
          purpleLight: "#EEF2FF",
          purpleBorder: "#C7D2FE",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        cardHover: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)",
        sheet: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
