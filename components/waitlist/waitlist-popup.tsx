"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Avatar is sourced from Twitter profile after sign-in

interface WaitlistFormData {
  name: string;
  walletAddress: string;
  avatar: string;
  avatarType: "upload" | "avatar_seed";
  avatarSeed?: string;
  avatarStyle?: string;
}

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: WaitlistFormData) => Promise<void>;
  profileId: number | null;
}

const WaitlistPopup: React.FC<WaitlistPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  profileId,
}) => {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; wallet?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user,
    username,
    login,
  } = useAuth();
  const [prefilledFromTwitter, setPrefilledFromTwitter] = useState(false);

  // Disable submit until all required inputs are valid
  const canSubmit = (() => {
    const nameOk = name.trim().length > 0;
    const walletOk = /^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim());
    const avatarOk = !!uploadedImage; // Require Twitter avatar
    return nameOk && walletOk && avatarOk;
  })();

  // Remove random avatar generation - only Twitter avatar is used

  // If authenticated, prefill name and avatar from Twitter once per open
  useEffect(() => {
    if (!isOpen) return;
    if (isAuthenticated && user && !prefilledFromTwitter) {
      const handle = username ? `@${username}` : user.name || "";
      if (!name) setName(handle);
      if (user.image) setUploadedImage(user.image);
      setPrefilledFromTwitter(true);
    }
  }, [isOpen, isAuthenticated, user, username]);

  const applyTwitterProfile = () => {
    if (user) {
      const handle = username ? `@${username}` : user.name || "";
      setName(handle);
      if (user.image) setUploadedImage(user.image);
      setPrefilledFromTwitter(true);
    }
  };

  // Removed random avatar style/options logic

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { name?: string; wallet?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!walletAddress.trim()) {
      newErrors.wallet = "Wallet address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())) {
      newErrors.wallet = "Invalid wallet address format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (!uploadedImage) {
        alert("Please sign in with X to use your profile photo");
        return;
      }
      const entry: WaitlistFormData = {
        name: name.trim(),
        walletAddress: walletAddress.trim(),
        avatar: uploadedImage,
        avatarType: "upload", // Use Twitter image URL as upload type
      };

      await onSubmit(entry);

      // Reset form
      setName("");
      setWalletAddress("");
      setUploadedImage(null);
      setErrors({});
    } catch (error) {
      console.error("Error submitting waitlist entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Removed manual image upload handlers

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="sm:max-w-md w-[90vw] max-h-[90vh] sm:max-h-[85vh] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg sm:rounded-xl [&>button]:text-white/70 [&>button]:hover:text-white [&>button]:hover:bg-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            Join the Waitlist
          </DialogTitle>
          <DialogDescription className="text-center text-white/70 text-sm sm:text-base">
            Be part of the future of DeFi lending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 overflow-hidden smooth-scroll scrollbar-hide">
          {/* Twitter Auth / Profile Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 flex items-center justify-between">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || ""}
                    />
                    <AvatarFallback>
                      {(user.name || "U").slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    {username && (
                      <span className="text-xs text-white/70">@{username}</span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={applyTwitterProfile}
                  className="text-white/70 border-white/30 hover:bg-white/20 hover:text-white transition-all"
                >
                  Use profile
                </Button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-sm text-white/80">
                  Sign in to use your X profile
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={login}
                  disabled={isAuthLoading}
                  className="text-white/70 border-white/30 hover:bg-white/20 hover:text-white transition-all"
                >
                  {isAuthLoading ? "Signing in..." : "Sign in with X"}
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:border-orange-500 focus:bg-white/20 transition-all ${
                  errors.name ? "border-red-400" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Wallet Address Field */}
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                pattern="^0x[a-fA-F0-9]{40}$"
                className={`bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:border-orange-500 focus:bg-white/20 transition-all font-mono text-sm ${
                  errors.wallet ? "border-red-400" : ""
                }`}
              />
              {errors.wallet && (
                <p className="text-red-400 text-sm">{errors.wallet}</p>
              )}
            </div>

            {/* Avatar Preview (Twitter image) */}
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/70">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Twitter avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/60 text-xs">
                      No avatar
                    </div>
                  )}
                </div>
                <div className="text-xs text-white/70">
                  {uploadedImage
                    ? "Using your X profile photo"
                    : "Sign in with X above to use your profile photo"}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-1.5 sm:py-2 text-sm sm:text-base backdrop-blur-sm border border-orange-500/50 shadow-lg transition-all"
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistPopup;
