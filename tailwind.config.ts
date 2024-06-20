import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        discord: "url('/discord.png')",
        gradient: "linear-gradient(to bottom, #00BCB6, #15AC5B);",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#15AC5B",
          "primary-content": "#FFFFFF",
          secondary: "#FFFFFF",
          error: "#f04265",
          info: "#2094f3",
          "base-300": "#7a8aa0",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#15AC5B",
          "primary-content": "#FFFFFF",
          secondary: "#FFFFFF",
          error: "#f04265",
          info: "#2094f3",
          "base-100": "#1d232a",
          "base-200": "#191e24",
          "base-300": "#15191e",
          neutral: "#2a323c",
          "base-content": "#d6d6d6",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
