import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// metadataBase resolves every relative URL below (canonical, og:image, etc.)
// against the production origin so scrapers receive absolute URLs.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · Keyfetti" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "keyboard toy",
    "kids keyboard game",
    "toddler learning",
    "alphabet for kids",
    "baby keyboard",
    "learn letters",
    "confetti keyboard",
    "Keyfetti",
  ],
  authors: [{ name: "Rayhan" }],
  creator: "Rayhan",
  publisher: "Keyfetti",
  category: "education",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // og:image is injected automatically from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // twitter:image is injected automatically from app/twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  // manifest is auto-linked from app/manifest.ts
};

export const viewport: Viewport = {
  themeColor: "#0a0f1f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden bg-[#0a0f1f] text-white">{children}</body>
    </html>
  );
}
