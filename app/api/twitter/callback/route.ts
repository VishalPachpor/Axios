import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !code) {
      return NextResponse.redirect(
        new URL("/waitlist?error=missing_params", request.url)
      );
    }

    const storedState = request.cookies.get("tw_state")?.value;
    const codeVerifier = request.cookies.get("tw_code_verifier")?.value;
    if (!storedState || !codeVerifier || storedState !== state) {
      return NextResponse.redirect(
        new URL("/waitlist?error=state_mismatch", request.url)
      );
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    });

    const { client: loggedClient } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/twitter/callback`,
    });

    const me = await loggedClient.v2.me({
      "user.fields": ["id", "name", "username", "profile_image_url"],
    });

    // Post message back to the opener (popup flow). Render a minimal HTML to do window.opener.postMessage
    const html = `<!doctype html><html><body><script>
      window.opener && window.opener.postMessage({
        source: 'twitter-oauth',
        user: ${JSON.stringify(me.data)}
      }, '${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}');
      window.close();
    </script></body></html>`;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  } catch (e) {
    console.error("/api/twitter/callback error", e);
    return NextResponse.redirect(
      new URL("/waitlist?error=callback_failed", request.url)
    );
  }
}
