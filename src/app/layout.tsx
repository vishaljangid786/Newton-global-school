import type { Metadata } from "next";
import { Instrument_Sans, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChromeGate from "@/components/layout/ChromeGate";
import NotificationBanner from "@/components/layout/NotificationBanner";
import { site } from "@/data/site";

/* Display sans — the corporate voice of the redesign (headings, numerals). */
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-sora",
  display: "swap",
});

/* Body sans. */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
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
      className={`${sora.variable} ${instrument.variable} h-full antialiased`}
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
