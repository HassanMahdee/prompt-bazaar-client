// src/app/layout.js
import { AppProviders } from "@/providers/appProviders"; // Your HeroUI/Theme provider
import { AuthProvider } from "@/providers/authProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-obsidian text-foreground">
        <AppProviders>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}