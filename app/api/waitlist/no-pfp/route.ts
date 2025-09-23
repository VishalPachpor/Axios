import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function isNoPfp(avatar: string | null, avatarType: string | null): boolean {
  if (!avatar) return true;
  if (avatarType && avatarType !== "upload") return true;
  const a = avatar.toLowerCase();
  const looksHttp = a.startsWith("http://") || a.startsWith("https://");
  const looksData = a.startsWith("data:");
  const looksTwitterDefault = a.includes("default_profile_images");
  return (!looksHttp && !looksData) || looksTwitterDefault;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  if (!supabase) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("waitlist_entries")
    .select(
      "id,name,wallet_address,avatar,avatar_type,profile_id,created_at,twitter_username"
    )
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }

  const noPfp = (data || []).filter((e: any) =>
    isNoPfp(e.avatar, e.avatar_type)
  );

  if (format === "count") {
    return NextResponse.json({ count: noPfp.length });
  }

  if (format === "csv") {
    const header = [
      "id",
      "name",
      "twitter_username",
      "wallet_address",
      "profile_id",
      "avatar_type",
      "avatar",
      "created_at",
    ];
    const rows = noPfp.map((e: any) => [
      e.id,
      e.name,
      e.twitter_username ?? "",
      e.wallet_address,
      e.profile_id,
      e.avatar_type,
      e.avatar,
      e.created_at,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=users_no_pfp.csv",
      },
    });
  }

  return NextResponse.json({ count: noPfp.length, users: noPfp });
}
