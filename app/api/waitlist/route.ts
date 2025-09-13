import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Simple in-memory rate limiter (per process). For production, use KV/Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const ipToRequests: Map<string, { count: number; resetAt: number }> = new Map();

const payloadSchema = z.object({
  name: z.string().min(1).max(255),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/i, "Invalid wallet address format"),
  avatar: z.string().min(1),
  avatarType: z.enum(["upload", "avatar_seed"]),
  avatarSeed: z.string().optional(),
  avatarStyle: z.string().optional(),
  profileId: z.number().int().positive(),
});

function rateLimit(req: NextRequest): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = ipToRequests.get(ip);
  if (!current || now > current.resetAt) {
    ipToRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }
  if (current.count >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    });
  }
  current.count += 1;
  return null;
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req);
  if (rl) return rl;

  // Require authenticated Twitter session
  const session: any = await getServerSession(authOptions as any);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const twitterUserId = (session.user as any).id as string | undefined;
  const twitterUsername = (session.user as any).username as string | undefined;
  if (!twitterUserId) {
    return NextResponse.json(
      { error: "Twitter account not available in session" },
      { status: 400 }
    );
  }

  const json = await req.json().catch(() => null);
  const parse = payloadSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parse.error.flatten() },
      { status: 400 }
    );
  }
  const {
    name,
    walletAddress,
    avatar,
    avatarType,
    avatarSeed,
    avatarStyle,
    profileId,
  } = parse.data;

  if (!supabase) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 }
    );
  }

  // Enforce unique wallet and unique profile position with upsert-like logic
  try {
    // Hard stop if this Twitter user already joined once
    const { data: existingByTwitter } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("twitter_user_id", twitterUserId)
      .maybeSingle();

    if (existingByTwitter) {
      return NextResponse.json(
        { error: "This Twitter account already joined the waitlist" },
        { status: 409 }
      );
    }

    // Check existing by wallet
    const { data: existingByWallet } = await supabase
      .from("waitlist_entries")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (existingByWallet) {
      // If same profile, return existing
      if (existingByWallet.profile_id === profileId) {
        return NextResponse.json(existingByWallet, { status: 200 });
      }
      // Do not allow moving positions; one-time join only
      return NextResponse.json(
        { error: "This wallet is already on the waitlist" },
        { status: 409 }
      );
    }

    // Ensure profileId not taken
    const { data: taken } = await supabase
      .from("waitlist_entries")
      .select("id")
      .eq("profile_id", profileId)
      .maybeSingle();
    if (taken) {
      return NextResponse.json(
        { error: "This position is already taken" },
        { status: 409 }
      );
    }

    // Insert new
    const { data, error } = await supabase
      .from("waitlist_entries")
      .insert({
        name,
        wallet_address: walletAddress,
        avatar,
        avatar_type: avatarType,
        avatar_seed: avatarSeed,
        avatar_style: avatarStyle,
        profile_id: profileId,
        twitter_user_id: twitterUserId,
        twitter_username: twitterUsername ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("/api/waitlist error", err);
    return NextResponse.json(
      { error: "Failed to process waitlist request" },
      { status: 500 }
    );
  }
}
