"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col axios-gradient-bg">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-destructive mb-4">Error</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-8">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="text-left mb-6 p-4 bg-muted/20 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-foreground mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {error.message}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}


