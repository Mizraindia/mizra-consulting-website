import type { Metadata } from "next";
import { Instrument_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from '@/components/Analytics';
import FloatingCTA from '@/components/FloatingCTA';

// Fonts from the approved design, served from this site (no Google request at runtime).
const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mizraconsulting.com'),
  title: {
    default: "Mizra Consulting: Salesforce, Zoho, Custom Development and Consulting",
    template: "%s | Mizra Consulting"
  },
  description: "Mizra Consulting implements Salesforce and Zoho, builds custom web and mobile software, and offers consulting. Based in India, working with clients worldwide. Reply within 4 business hours.",
  // No meta keywords: search engines ignore them, and the old list advertised services
  // Mizra does not offer.
  icons: {
    icon: "/mizra-logo.png",
  },
  authors: [{ name: "Mizra Consulting" }],
  creator: "Mizra Consulting",
  publisher: "Mizra Consulting",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Defaults only. Each page sets its own canonical address and sharing tags (src/lib/metadata.ts).
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mizra Consulting",
    title: "Mizra Consulting: Salesforce, Zoho, Custom Development and Consulting",
    description: "Mizra Consulting implements Salesforce and Zoho, builds custom web and mobile software, and offers consulting. Based in India, working with clients worldwide. Reply within 4 business hours.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mizra: Salesforce, Zoho, custom development and consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mizra Consulting: Salesforce, Zoho, Custom Development and Consulting",
    description: "Mizra Consulting implements Salesforce and Zoho, builds custom web and mobile software, and offers consulting. Based in India, working with clients worldwide. Reply within 4 business hours.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <link rel="icon" href="/mizra-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/mizra-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-mz-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
