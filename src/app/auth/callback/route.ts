import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { seedDemoData } from "@/lib/db/seed";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Seed demo data for new users (no-op if user already has articles)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await seedDemoData(user.id).catch(() => {
          // Non-blocking: don't fail login if seed fails
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
