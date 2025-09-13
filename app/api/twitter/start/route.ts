import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

// Start OAuth 2.0 with PKCE. Returns redirect URL and stores temp values in cookies
export async function GET(request: NextRequest) {
  try {
    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/twitter/callback`,
      { scope: ["users.read"] }
    );

    const response = NextResponse.json({ url });
    response.cookies.set("tw_state", state, {
      httpOnly: true,
      secure: false,
      maxAge: 900,
      path: "/",
    });
    response.cookies.set("tw_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: false,
      maxAge: 900,
      path: "/",
    });
    return response;
  } catch (e) {
    console.error("/api/twitter/start error", e);
    return NextResponse.json(
      { error: "Failed to start Twitter OAuth" },
      { status: 500 }
    );
  }
}
