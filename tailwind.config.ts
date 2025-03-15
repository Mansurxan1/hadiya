import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "phone-min": "350px",
        "phone-max": "420px",
        "md-lg": "1000px",
      },
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite",
        wave: "wave 1.5s ease-in-out infinite",
        "wave-delay": "wave 1.5s ease-in-out infinite 0.2s",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
