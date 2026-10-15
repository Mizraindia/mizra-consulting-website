import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from '@/components/Analytics';
import FloatingCTA from '@/components/FloatingCTA';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mizraconsulting.com'),
  title: {
    default: "Mizra Consulting - IT Services & Digital Transformation Solutions",
    template: "%s | Mizra Consulting"
  },
  description: "Mizra Consulting implements Salesforce and Zoho, builds custom web and mobile software, and offers consulting. Based in India, working with clients worldwide. Reply within 4 business hours.",
  keywords: [
    "IT consulting services",
    "custom software development",
    "digital transformation",
    "cloud computing services",
    "AI machine learning solutions",
    "enterprise software development",
    "IT staff augmentation",
    "DevOps consulting",
    "software engineering services",
    "technology consulting firm",
    "MVP development",
    "SaaS development",
    "mobile app development",
    "web application development",
    "IT project management"
  ],
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
    title: "Mizra Consulting - IT Services & Digital Transformation Solutions",
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
    title: "Mizra Consulting - IT Services & Digital Transformation",
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/mizra-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/mizra-logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
        <Analytics />
      </body>
    </html>
  );
}
