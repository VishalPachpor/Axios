import { NextRequest, NextResponse } from "next/server";

// Redirect old Twitter auth route to NextAuth signin
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/waitlist";

  // Redirect to the proper NextAuth signin URL
  const signinUrl = `/api/auth/signin/twitter?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;

  return NextResponse.redirect(new URL(signinUrl, request.url));
}
