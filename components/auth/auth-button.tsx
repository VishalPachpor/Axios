"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showUserInfo?: boolean;
}

export function AuthButton({
  variant = "default",
  size = "default",
  showUserInfo = false,
}: AuthButtonProps) {
  const { isAuthenticated, isLoading, user, login, logout, username } =
    useAuth();

  if (isLoading) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        {showUserInfo && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || ""}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">@{username}</span>
            </div>
          </div>
        )}
        <Button variant={variant} size={size} onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button variant={variant} size={size} onClick={login}>
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Twitter
    </Button>
  );
}
