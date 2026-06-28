/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8F4EE",
        primary: "#7A1F1F",
        dark: "#2C1810",
        secondary: "#C89B3C",
        text: "#3A1C1C",
        muted: "#6E6E6E",
        border: "#E8DDD0",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 24px 48px -24px rgba(44, 24, 16, 0.18)",
        soft: "0 8px 28px -16px rgba(44, 24, 16, 0.15)",
      },
      letterSpacing: {
        widest2: "0.32em",
      },
      maxWidth: {
        container: "1280px",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
