import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        bangers: ["Bangers", "cursive"],
        comic: ["Comic Neue", "cursive"]
      },
      colors: {
        ink: "#1a1a2e",
        panel: "#fffef5",
        accent: "#e63946",
        gold: "#f4a261",
        sky: "#457b9d"
      },
      boxShadow: {
        comic: "4px 4px 0px #1a1a2e",
        panel: "6px 6px 0px #1a1a2e"
      }
    }
  },
  plugins: []
};
export default config;
