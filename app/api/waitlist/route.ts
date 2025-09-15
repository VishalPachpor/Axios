import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Simple in-memory rate limiter (per process). For production, use KV/Upstash.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_BASE_MAX = 10;
const ipToRequests: Map<string, { count: number; resetAt: number }> = new Map();

// Soft capacity guardrails (can be tuned via env)
const MAX_WAITLIST_CAPACITY = Number(
  process.env.WAITLIST_MAX_CAPACITY || 10000
);
const RATE_LIMIT_MEDIUM_THRESHOLD = Number(
  process.env.WAITLIST_MEDIUM_THRESHOLD || 1000
);
const RATE_LIMIT_HIGH_THRESHOLD = Number(
  process.env.WAITLIST_HIGH_THRESHOLD || 5000
);

// Short‑lived count cache to avoid count(*) on every request
let cachedCount: { value: number; expiresAt: number } | null = null;
const COUNT_TTL_MS = 10_000; // 10s cache

async function getWaitlistCount(): Promise<number> {
  if (!supabase) return 0;
  const now = Date.now();
  if (cachedCount && now < cachedCount.expiresAt) {
    return cachedCount.value;
  }
  const { count, error } = await supabase
    .from("waitlist_entries")
    .select("*", { count: "exact", head: true });
  if (error) {
    // On error, fall back to previous cached value if present
    return cachedCount?.value ?? 0;
  }
  cachedCount = { value: count || 0, expiresAt: now + COUNT_TTL_MS };
  return cachedCount.value;
}

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

function getDynamicRateLimitMax(currentSize: number): number {
  if (currentSize >= RATE_LIMIT_HIGH_THRESHOLD) return 5; // strictest
  if (currentSize >= RATE_LIMIT_MEDIUM_THRESHOLD) return 8; // moderate
  return RATE_LIMIT_BASE_MAX; // normal
}

function rateLimit(req: NextRequest, currentSize: number): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = ipToRequests.get(ip);
  const dynamicMax = getDynamicRateLimitMax(currentSize);
  if (!current || now > current.resetAt) {
    ipToRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }
  if (current.count >= dynamicMax) {
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
  // Evaluate count before applying dynamic RL and capacity guard
  const currentSize = await getWaitlistCount();
  const rl = rateLimit(req, currentSize);
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
    // Capacity guardrail
    if (currentSize >= MAX_WAITLIST_CAPACITY) {
      return NextResponse.json(
        { error: "Waitlist is currently full. Please try again later." },
        { status: 429 }
      );
    }

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
    // Invalidate count cache on successful insert
    cachedCount = null;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("/api/waitlist error", err);
    return NextResponse.json(
      { error: "Failed to process waitlist request" },
      { status: 500 }
    );
  }
}

// Lightweight stats endpoint for client optimization and observability
export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Database is not configured" },
      { status: 500 }
    );
  }

  const size = await getWaitlistCount();
  const tier = getDynamicRateLimitMax(size);
  return NextResponse.json({
    size,
    capacity: MAX_WAITLIST_CAPACITY,
    rateLimitPerMinute: tier,
  });
}
