// src/providers/appProviders.jsx
"use client";

// src/providers/appProviders.jsx
"use client";

// Remove the HeroUIProvider import
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function AppProviders({ children }) {
  return (
    // Keep your ThemeProvider if you still need it for dark mode
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}