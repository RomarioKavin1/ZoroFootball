import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const minecraft = localFont({
  src: "./fonts/Minecraft.ttf",
  variable: "--font-minecraft",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "Head Footaball",
  description: "Balling",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={minecraft.className}>{children}</body>
    </html>
  );
}
