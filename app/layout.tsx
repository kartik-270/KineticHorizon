import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetic Horizon | Precision Golf. Purposeful Impact.",
  description: "Join the world's most purposeful golf community. Elevate your game through precision tracking and meaningful global charity contributions.",
  keywords: ["golf", "impact", "charity", "subscriptions", "competitions", "kinetic", "horizon"],
  verification: {
    google: '39eC-3uLPsyxpmG-CvFLWTAO9DheJfC_kXXIPYFO2ck',
  },
  authors: [{ name: "Kinetic Horizon Team" }],
  openGraph: {
    title: "Kinetic Horizon | Elevate Your Game",
    description: "A premium golf platform where precision meets purpose.",
    url: "https://kinetic-horizon.vercel.app",
    siteName: "Kinetic Horizon",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kinetic Horizon Impact Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinetic Horizon | Elevate Your Game",
    description: "Precision golf tracking and global impact.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-body">
        {children}
        <Toaster position="bottom-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
