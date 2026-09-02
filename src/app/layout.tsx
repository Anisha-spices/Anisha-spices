import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Anisha Spices — Pure Spice. Real Taste. Trusted Every Time.",
    template: "%s | Anisha Spices",
  },
  description:
    "Anisha Spices brings the richness of India's finest spices to your kitchen. Pure, natural & full of flavor.",
  icons: {
    icon: '/images/logo.jpeg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAF6F2] text-[#2A1612] selection:bg-[#6B1118] selection:text-white">
        {children}
      </body>
    </html>
  );
}
