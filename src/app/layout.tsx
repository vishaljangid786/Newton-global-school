import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChromeGate from "@/components/layout/ChromeGate";
import NotificationBanner from "@/components/layout/NotificationBanner";
import { site } from "@/data/site";

/*
 * Display face — rounded and warm, the voice school sites in the region use.
 * Sora sat here before and read as a tech company; Baloo 2 carries the same
 * confidence with none of the corporate edge, and covers Devanagari for when
 * the school wants Hindi alongside English.
 */
const display = Baloo_2({
  subsets: ["latin", "devanagari"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

/* Body face — rounded terminals to match the display, built for long reading. */
const body = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body-sans",
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      {/* Browser extensions add attributes to <body> before React hydrates
          (ColorZilla's cz-shortcut-listen, Grammarly's data-gr-*, …). This
          suppresses that unavoidable mismatch — one level deep only, so real
          mismatches inside the page still surface. */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-bg font-body text-text"
      >
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
