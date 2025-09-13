import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

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
      // Move to new profile
      const { data, error } = await supabase
        .from("waitlist_entries")
        .update({
          profile_id: profileId,
          name,
          avatar,
          avatar_type: avatarType,
          avatar_seed: avatarSeed,
          avatar_style: avatarStyle,
        })
        .eq("wallet_address", walletAddress)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data, { status: 200 });
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
