import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#64748B",
        line: "#E5EAF0",
        cloud: "#F7FBFF",
        violet: "#7B3FF2",
        blue: "#5A78F0",
        azure: "#3A9AF2",
        cyan: "#22C7D9"
      },
      fontFamily: {
        sans: ["var(--font-english)", "var(--font-myanmar)", "system-ui", "sans-serif"],
        myanmar: ["var(--font-myanmar)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(17, 24, 39, 0.12)",
        soft: "0 16px 48px rgba(90, 120, 240, 0.12)"
      },
      backgroundImage: {
        brand: "linear-gradient(135deg, #7B3FF2 0%, #5A78F0 34%, #3A9AF2 68%, #22C7D9 100%)",
        mesh: "radial-gradient(circle at 15% 15%, rgba(123, 63, 242, 0.14), transparent 28%), radial-gradient(circle at 82% 20%, rgba(34, 199, 217, 0.18), transparent 26%), linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)"
      }
    }
  },
  plugins: []
};

export default config;
