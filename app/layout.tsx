import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import StoreProvider from "./store/StoreProvider";
import FloatingThemeToggle from "./components/FloatingThemeToggle";
import { Analytics } from "@vercel/analytics/next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "Jacob Christian G. | Software Engineer",
  description: "Developing apps that blend engineering, finance, and art. Full-stack engineer with experience at Fortune 500 companies, GHD, and Megawide.",
  keywords: ["software engineer", "full-stack developer", "React", "Next.js", "TypeScript", "portfolio"],
  authors: [{ name: "Jacob Christian G." }],
  openGraph: {
    title: "Jacob Christian G. | Software Engineer",
    description: "Developing apps that blend engineering, finance, and art.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacob Christian G. | Software Engineer",
    description: "Developing apps that blend engineering, finance, and art.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body id="layout-body"> 
        <StoreProvider>
          <Navbar />
          <main id="layout-main" className="pt-24 pb-24">{children}</main>
          <FloatingThemeToggle />
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
