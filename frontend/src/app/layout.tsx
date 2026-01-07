import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Entropy Engine | Lottery Variance Reduction",
  description: "Statistical filtering for lottery combinations using inverse probability and combinatorial analysis. For entertainment purposes only.",
  keywords: ["lottery", "probability", "statistics", "powerball", "entropy"],
  robots: "noindex, nofollow",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0071e3" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
