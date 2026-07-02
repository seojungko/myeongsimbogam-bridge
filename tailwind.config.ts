import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          page: "#000000",
          card: "#171717",
          cardMuted: "#222222",
          hairline: "#303030"
        },
        accent: {
          ocean: "#38bdf8",
          forest: "#34d399",
          ember: "#fb7185",
          violet: "#a78bfa"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "Pretendard",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "system-ui",
          "sans-serif"
        ],
        mono: ["SFMono-Regular", "Consolas", "ui-monospace", "monospace"]
      },
      boxShadow: {
        soft: "0 18px 60px rgb(0 0 0 / 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
