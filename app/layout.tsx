import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustRepID — the behavioral credit score for AI agents",
  description:
    "ZKP-verified, non-transferable reputation for AI agents — earned through constitutional behavior, scored live on the HyperDAG engine. ERC-8004 identity + EAS attestations on Base Sepolia.",
  metadataBase: new URL("https://trustrepid.dev"),
  openGraph: {
    title: "TrustRepID — the behavioral credit score for AI agents",
    description:
      "ZKP-verified, non-transferable reputation for AI agents. Earned, not assigned.",
    url: "https://trustrepid.dev",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
