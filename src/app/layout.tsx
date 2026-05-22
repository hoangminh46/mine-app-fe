import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import { buildSearchIndex } from "@/lib/search";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mine Knowledge Base",
  description:
    "Personal knowledge base & second brain — Lưu trữ, tổ chức và học tập kiến thức hiệu quả",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = await buildSearchIndex();

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <AppShell searchIndex={searchIndex}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
