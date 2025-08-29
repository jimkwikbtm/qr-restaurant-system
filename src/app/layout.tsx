import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Restaurant Management System",
  description: "Modern QR code-based restaurant management system with multi-branch support and role-based access control",
  keywords: ["QR Restaurant", "Restaurant Management", "Food Ordering", "Multi-branch", "Bangladesh"],
  authors: [{ name: "QR Restaurant Team" }],
  openGraph: {
    title: "QR Restaurant Management System",
    description: "Modern QR code-based restaurant management system for Bangladesh",
    siteName: "QR Restaurant",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Restaurant Management System",
    description: "Modern QR code-based restaurant management system for Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
