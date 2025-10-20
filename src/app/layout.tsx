import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import OfferComponent from "@/components/layout/CallVideo/OfferComponent";
import MobieSideBar from "@/components/layout/SideBar/MobieSideBar";
import SocketProvider from "@/components/layout/SocketProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram",
  description: "Clone Instagram with Next.js",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head suppressHydrationWarning>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://localhost:5000" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black dark:text-primary-white text-black`}
      >
        <Toaster
          richColors
          duration={2000}
          position="top-right"
          closeButton={true}
        />

        <SocketProvider>{children}</SocketProvider>
        {/* <DarkMode></DarkMode> */}
        <OfferComponent></OfferComponent>
        <MobieSideBar></MobieSideBar>
      </body>
    </html>
  );
}
