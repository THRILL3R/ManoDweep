import type { Metadata } from "next";
import { Nunito, Playfair_Display, Baloo_2 } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ManoDweep — Island of the Mind",
  description: "Your daily mental wellness companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${nunito.variable} ${playfair.variable} ${baloo.variable} font-[family-name:var(--font-nunito)] min-h-full`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
