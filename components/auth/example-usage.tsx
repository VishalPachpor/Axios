"use client";

import { AuthButton, ProtectedRoute } from "@/components/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExampleAuthPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Example</CardTitle>
          <CardDescription>
            This page demonstrates the Twitter authentication system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Public content - always visible */}
          <div>
            <h3 className="font-semibold mb-2">Public Content</h3>
            <p className="text-sm text-muted-foreground">
              This content is visible to everyone, authenticated or not.
            </p>
            <AuthButton variant="outline" className="mt-2" />
          </div>

          {/* Protected content - only visible when authenticated */}
          <ProtectedRoute>
            <div>
              <h3 className="font-semibold mb-2">Protected Content</h3>
              <p className="text-sm text-muted-foreground">
                This content is only visible to authenticated users.
              </p>
              <AuthButton
                variant="default"
                showUserInfo={true}
                className="mt-2"
              />
            </div>
          </ProtectedRoute>
        </CardContent>
      </Card>
    </div>
  );
}
