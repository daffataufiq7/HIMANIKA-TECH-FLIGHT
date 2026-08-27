import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "HIMANIKA TECH FLIGHT — Web Mini Game Open House FT",
  description: "Fly Further. Think Smarter. Mini game arcade booth Open House Fakultas Teknik HIMANIKA.",
};

export const viewport: Viewport = {
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
    <html lang="id" className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <body className="bg-background text-slate-100 antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
