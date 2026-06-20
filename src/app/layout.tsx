import type { Metadata } from "next";
import "./globals.css";
import { Archivo, Cormorant_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Fox Falcon | Premium Streetwear & Custom Designs",
  description: "Discover premium quality clothing and design your own custom T-shirts with Fox Falcon. Instinct meets power. Real-time tracking and worldwide shipping.",
  keywords: [
    "Fox Falcon",
    "Foc Falcon",
    "Fox Falcon clothing",
    "Fox Falcon streetwear",
    "Fox Falcon store",
    "Fox Falcon brand",
    "Fox Falcon India",
    "Fox Falcon custom tees",
    "custom streetwear",
    "oversized graphic tees",
    "luxury streetwear",
    "heavyweight blanks",
    "design your own T-shirt",
    "Creator Lab",
    "Prince Parmar Fox Falcon",
    "foxfalcon",
    "foxfalcon.com",
    "streetwear brand India",
    "cafe racer clothing",
    "premium street fashion"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", archivo.variable, cormorant.variable)} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <Providers>
          <Navbar />
          <main className="flex-grow min-h-[80vh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
