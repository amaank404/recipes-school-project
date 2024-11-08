import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': "500px",
      "md": "700px",
      "lg": "900px",
      "xl": "1200px",
      "2xl": "1500px",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-.+-(100|500|800)/,
      variants: ["hover", "active"]
    },
    {
      pattern: /text-.+-500/
    },
    "text-white",
    {
      pattern: /ring-.+-800/,
      variants: ["active"]
    }
  ]
};
export default config;
