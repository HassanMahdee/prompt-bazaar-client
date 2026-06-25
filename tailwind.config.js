const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // CRITICAL: This path allows HeroUI styles to be scanned and compiled
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core branding color definitions for custom Tailwind utility usage
        obsidian: {
          DEFAULT: "#090D16",
          light: "#111827",
          deep: "#05070B",
        },
        violet: {
          electric: "#7C3AED",
        },
        amber: {
          gold: "#F59E0B",
        },
      },
      // Custom shadows and backdrops to enforce the Glassmorphism style globally
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "glass-glow": "0 8px 32px 0 rgba(124, 58, 237, 0.1)", // Subtle Electric Violet glow
        "glass-border": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require("daisyui"),
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#090D16", // Cosmic Obsidian
            foreground: "#F3F4F6", // High-contrast text
            primary: {
              DEFAULT: "#7C3AED", // Electric Violet
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#F59E0B", // Amber Gold
              foreground: "#090D16",
            },
            focus: "#7C3AED",
          },
        },
      },
    }),
  ],
  daisyui: {
    themes: [
      {
        promptbazaar: {
          primary: "#7C3AED", // Electric Violet
          secondary: "#F59E0B", // Amber Gold
          accent: "#A78BFA", // Muted Lavender
          neutral: "#1F2937", // Charcoal
          "base-100": "#090D16", // Cosmic Obsidian
          "base-200": "#111827", // Slightly lighter obsidian for cards
          "base-300": "#1F2937",
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
    // Forces your custom dark theme to be the default layer
    defaultTheme: "promptbazaar",
  },
};
