import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
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
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.username + "@twitter.local", // Twitter doesn't provide email in v2
          image: profile.data.profile_image_url?.replace("_normal", ""), // Get larger image
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.username = (profile as any).data?.username;
        token.picture = (profile as any).data?.profile_image_url?.replace(
          "_normal",
          ""
        );
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
