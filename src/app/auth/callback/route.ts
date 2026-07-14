import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Don't silently drop the user on the dashboard without a session.
      return NextResponse.redirect(`${origin}/login?error=auth`);
    }
  }

  return NextResponse.redirect(origin);
}
