"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = useCallback(() => {
    signIn("twitter", { callbackUrl: "/waitlist" });
  }, []);

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const isLoading = status === "loading";
  const isAuthenticated = !!session;
  const user = session?.user;

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    username: user?.username,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
  };
}
