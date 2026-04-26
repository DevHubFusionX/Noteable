import type { Metadata } from "next";
import { Mulish, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundGrid } from "@/components/ui/BackgroundGrid";
import { ThemeProvider } from "@/lib/ThemeContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { QueryProvider } from "@/lib/QueryProvider";
import { ToastRenderer } from "@/components/ui/ToastRenderer";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noteable - Elevate Your Strategic Thinking",
  description: "A free and flexible app designed to securely capture, organize, and reflect on your private thoughts anytime, anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.variable} ${geistMono.variable} min-h-screen w-full antialiased font-sans flex flex-col relative`}
      >
        <QueryProvider>
          <ThemeProvider>
            <BackgroundGrid />
            <LoadingScreen />
            <main className="flex-1 relative z-10 w-full">{children}</main>
            <ToastRenderer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
