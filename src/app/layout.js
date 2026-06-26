import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/providers/appProviders";
import { AuthProvider } from "@/providers/authProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import "./globals.css";

// Configure tech-forward display font for headings
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Configure premium clean font for UI controls and body prose
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Prompt Bazaar - Premium AI Prompt Marketplace",
  description:
    "Discover, buy, copy, and benchmark state-of-the-art AI prompts for ChatGPT, Midjourney, and Stable Diffusion.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}
    >
      <body className="bg-obsidian text-foreground font-sans antialiased min-h-screen flex flex-col selection:bg-violet-electric/30 selection:text-white">
        <AppProviders>
          <AuthProvider>
            {/* Global Sticky Navigation Header Module */}
            <Navbar />

            {/* Dynamic Core Viewport Wrapper Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
              {children}
            </main>

            {/* Shared Structural Footer Platform Grid */}
            <Footer />
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
