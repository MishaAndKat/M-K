import type { Config } from "tailwindcss";

// Rose Smoke: сливово-чёрный фон, пыльно-розовый акцент, дымка.
// Названия цветов (ink, paper, mist, line, thread, void) оставлены прежними,
// чтобы все компоненты продолжали работать — поменялись только значения.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F4E6EC",
        paper: "#150B14",
        mist: "#A58E9B",
        line: "#3A2433",
        "line-dark": "rgb(var(--line-dark-rgb) / <alpha-value>)",
        void: "#120912",
        "void-deep": "#0C060B",
        thread: "rgb(var(--accent-rgb) / <alpha-value>)",
        "thread-soft": "rgb(var(--accent-soft-rgb) / <alpha-value>)",
        ember: "#E0667F",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "smoke-a": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(3%,-2%,0) scale(1.08)" },
        },
        "smoke-b": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
          "50%": { transform: "translate3d(-3%,2%,0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
