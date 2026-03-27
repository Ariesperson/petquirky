import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D85A30",
          light: "#FF8A65",
          tint: "#FFF0EB",
        },
        dark: "#2D2D2D",
        muted: "#888888",
        background: "#F5F5F0",
        success: "#1D9E75",
        warning: "#BA7517",
        error: "#D32F2F",
      },
      fontFamily: {
        heading: ['"Baloo 2"', "cursive"],
        body: ['"Quicksand"', "sans-serif"],
      },
      borderRadius: {
        brand: "8px",
        "brand-lg": "16px",
      },
    },
  },
};

export default config;
