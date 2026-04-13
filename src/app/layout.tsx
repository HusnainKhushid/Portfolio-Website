
import type { Metadata, Viewport } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin"], weight: "400" });

// ─── Viewport (themeColor + colorScheme belong here in Next.js 13+) ──────────
export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Husnain | Creative Developer",
  description: "A portfolio showcasing modern, interactive WebGL experiences and premium frontend development.",
  keywords: ["Creative Developer", "Frontend Engineer", "WebGL", "React", "Next.js", "Portfolio", "GSAP", "Three.js"],
  authors: [{ name: "Husnain" }],
  openGraph: {
    title: "Husnain | Creative Developer",
    description: "A portfolio showcasing modern, interactive WebGL experiences and premium frontend development.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Husnain | Creative Developer",
    description: "A portfolio showcasing modern, interactive WebGL experiences and premium frontend development.",
  },
  robots: "index, follow",
};

// Critical inline CSS — injected directly into the HTML response so Chrome
// applies background:#0d0d0d BEFORE the external Tailwind stylesheet downloads.
// This is the only reliable way to kill the grey flash in Chrome.
const criticalCSS = `
  html, body {
    background: #0d0d0d !important;
    color-scheme: dark;
    margin: 0;
    padding: 0;
    min-height: 100%;
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: "#0d0d0d", colorScheme: "dark" }}>
      <head>
        {/* Critical CSS — zero-latency background before any stylesheet loads */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body className={`${oswald.className} overflow-x-hidden`}>{children}</body>
    </html>
  );
}
