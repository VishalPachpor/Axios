import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 }
    );
  }

  const session: any = await getServerSession(authOptions as any);
  if (!session || !session.user?.id) {
    return NextResponse.json({ entry: null }, { status: 200 });
  }

  const twitterUserId = session.user.id as string;
  const { data, error } = await supabase
    .from("waitlist_entries")
    .select("*")
    .eq("twitter_user_id", twitterUserId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data || null });
}
