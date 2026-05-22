import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";
import { buildSearchIndex } from "@/lib/search";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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

  // Fetch user profile for navbar
  let userProfile: { displayName: string | null; avatarUrl: string | null } | null = null;
  const authUser = await getUser();
  if (authUser) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", authUser.id)
      .single();

    userProfile = {
      displayName: profile?.display_name || authUser.user_metadata?.full_name || null,
      avatarUrl: profile?.avatar_url || authUser.user_metadata?.avatar_url || null,
    };
  }

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <AppShell searchIndex={searchIndex} user={userProfile}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
