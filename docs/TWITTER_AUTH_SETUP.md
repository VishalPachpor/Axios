# Twitter Authentication Setup Guide

## Overview

This project uses NextAuth.js with Twitter OAuth 2.0 for authentication. The setup includes proper TypeScript types, session management, and token handling.

## Files Structure

```
app/
├── api/auth/[...nextauth]/route.ts    # NextAuth configuration
├── layout.tsx                         # Root layout with providers
└── providers.tsx                      # SessionProvider wrapper

types/
└── next-auth.d.ts                     # TypeScript declarations

env.template                           # Environment variables template
```

## Environment Variables

Copy `env.template` to `.env.local` and fill in your Twitter OAuth credentials:

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use existing one
3. Enable OAuth 2.0
4. Set callback URL: `http://localhost:3000/api/auth/callback/twitter`
5. Enable OAuth 2.0 with PKCE
6. Set the following scopes: `users.read`, `tweet.read`, `offline.access`
7. Copy Client ID and Client Secret to your `.env.local`

## Features Implemented

### ✅ Enhanced NextAuth Configuration

- Twitter OAuth 2.0 integration
- Proper scope configuration (`users.read tweet.read offline.access`)
- Enhanced profile mapping with larger profile images
- Access token and refresh token storage
- 30-day session duration
- Proper error handling and redirects

### ✅ TypeScript Support

- Extended Session interface with username, accessToken, refreshToken
- JWT token type definitions
- Full type safety for authentication

### ✅ Session Management

- JWT strategy for stateless authentication
- Token persistence across sessions
- Automatic token refresh handling

## Usage Examples

### Sign In Component

```tsx
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.name}</p>
        <p>Username: {session.user?.username}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
  );
}
```

### Server-Side Session Access

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/waitlist",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
```

### API Route with Authentication

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Access Twitter data
  const { accessToken, user } = session;

  return Response.json({
    user: user,
    username: user.username,
  });
}
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Secret Key**: Use a strong, random secret for `NEXTAUTH_SECRET`
3. **HTTPS**: Always use HTTPS in production
4. **Token Storage**: Tokens are stored securely in JWT format
5. **Session Duration**: 30-day expiration balances security and UX

## Troubleshooting

### Common Issues

1. **Callback URL Mismatch**: Ensure Twitter app callback URL matches exactly
2. **Scope Issues**: Verify required scopes are enabled in Twitter app
3. **Environment Variables**: Check all required env vars are set
4. **CORS Issues**: Ensure proper domain configuration

### Debug Mode

Set `NODE_ENV=development` to enable NextAuth debug logging.

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Set `NODE_ENV=production`
3. Update Twitter app callback URLs for production
4. Ensure HTTPS is enabled
5. Use a strong, unique `NEXTAUTH_SECRET`
