import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { MockProvider } from "@/mock/provider";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CarryLink — Someone is flying your way",
  description:
    "Discover CarryLink, a peer-to-peer carrying marketplace connecting travelers and senders between China and Germany.",
  icons: { icon: "/carrylink-mark.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}><LanguageProvider><MockProvider>{children}</MockProvider></LanguageProvider></body>
    </html>
  );
}
