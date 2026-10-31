import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AgeGate } from "@/components/layout/age-gate";

// Cormorant Garamond — тонкие, «журнальные» заголовки; Jost — лёгкий геометричный
// текст. Оба шрифта поддерживают кириллицу.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Night play · 18+",
  description: "Закрытый кинозал для двоих. Только для взрослых.",
  metadataBase: new URL("https://example.com"),
  // Сайт личный и взрослый — просим поисковики его не индексировать.
  robots: { index: false, follow: false },
  other: { rating: "adult" },
};

export const viewport: Viewport = {
  themeColor: "#120912",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${jost.variable} ${mono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <AgeGate />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
