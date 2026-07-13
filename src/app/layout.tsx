import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChromeGate from "@/components/layout/ChromeGate";
import NotificationBanner from "@/components/layout/NotificationBanner";
import { site } from "@/data/site";

/* Display serif — the editorial voice of the redesign (headings, numerals). */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

/* Body sans. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Monospace — eyebrows, labels, breadcrumbs, meta. */
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sunrise-school.example"),
  title: {
    template: `%s | ${site.name}`,
    default: `${site.name} — ${site.tagline}`,
  },
  description:
    "Newton Global School is a Jaipur school group with three campuses — City Center, Green Valley and Riverside — nurturing learners since 1998.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-body text-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <ChromeGate>
          <Header />
          <NotificationBanner />
        </ChromeGate>
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <ChromeGate>
          <Footer />
        </ChromeGate>
      </body>
    </html>
  );
}
