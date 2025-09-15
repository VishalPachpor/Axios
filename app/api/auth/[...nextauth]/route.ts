import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Helps with dynamic hosts (mobile, proxies) when NEXTAUTH_URL might differ
  trustHost: true,
  // Optional: set cookie domain for production to ensure consistent session on the same root domain
  cookies: process.env.NEXTAUTH_COOKIE_DOMAIN
    ? {
        sessionToken: {
          name:
            process.env.NODE_ENV === "production"
              ? "__Secure-next-auth.session-token"
              : "next-auth.session-token",
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
            domain: process.env.NEXTAUTH_COOKIE_DOMAIN,
          },
        },
      }
    : undefined,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Use Twitter OAuth 2.0
      authorization: {
        params: {
          scope: "users.read tweet.read offline.access",
        },
      },
      profile(profile) {
        const raw = profile as any;
        const data = raw?.data ?? raw;
        return {
          id: data?.id,
          name: data?.name,
          email: ((data?.username as string) || "user") + "@twitter.local", // Twitter doesn't provide email in v2
          image: (data?.profile_image_url as string | undefined)?.replace(
            "_normal",
            ""
          ), // Get larger image
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const raw = profile as any;
        const data = raw?.data ?? raw;
        token.username = data?.username as string | undefined;
        token.picture = (
          data?.profile_image_url as string | undefined
        )?.replace("_normal", "");
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).username = token.username;
        session.user.image = token.picture as string;
        session.user.id = token.sub;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        // Allow relative callback URLs
        if (url.startsWith("/")) return new URL(url, baseUrl).toString();
        // Allow same-origin absolute URLs
        const target = new URL(url);
        const base = new URL(baseUrl);
        if (target.origin === base.origin) return url;
        // Fallback to baseUrl for external URLs
        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
  pages: {
    signIn: "/waitlist", // Redirect to waitlist page after sign in
    error: "/waitlist", // Redirect errors to waitlist page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
