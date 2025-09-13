"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Sparkles, RefreshCw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  generateAvatarOptions,
  generateAvatarUrl,
  AVATAR_STYLES,
  AvatarStyle,
  getRandomBackground,
  getStyleDisplayName,
} from "@/lib/avatar-generator";

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
  const [activeTab, setActiveTab] = useState<"upload" | "anime">("anime");
  const [errors, setErrors] = useState<{ name?: string; wallet?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Anime avatar states
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState<string | null>(
    null
  );
  const [selectedAvatarStyle, setSelectedAvatarStyle] =
    useState<AvatarStyle>("adventurer");
  const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);

  // Disable submit until all required inputs are valid
  const canSubmit = (() => {
    const nameOk = name.trim().length > 0;
    const walletOk = /^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim());
    const avatarOk =
      (activeTab === "anime" && !!selectedAvatarSeed) ||
      (activeTab === "upload" && !!uploadedImage);
    return nameOk && walletOk && avatarOk;
  })();

  // Generate avatar options when anime tab is first accessed
  useEffect(() => {
    if (isOpen && avatarOptions.length === 0) {
      generateNewAvatarOptions();
    }
  }, [isOpen]);

  const generateNewAvatarOptions = async () => {
    setIsGeneratingAvatars(true);
    try {
      const newOptions = generateAvatarOptions(6, selectedAvatarStyle);
      setAvatarOptions(newOptions);
      setSelectedAvatarSeed(null); // Reset selection
    } catch (error) {
      console.error("Failed to generate avatar options:", error);
    } finally {
      setIsGeneratingAvatars(false);
    }
  };

  const handleStyleChange = async (newStyle: AvatarStyle) => {
    setSelectedAvatarStyle(newStyle);
    setSelectedAvatarSeed(null);
    setIsGeneratingAvatars(true);
    try {
      const newOptions = generateAvatarOptions(6, newStyle);
      setAvatarOptions(newOptions);
    } catch (error) {
      console.error("Failed to generate avatar options:", error);
    } finally {
      setIsGeneratingAvatars(false);
    }
  };

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
      let entry: WaitlistFormData;

      if (activeTab === "anime") {
        if (!selectedAvatarSeed) {
          alert("Please select an anime avatar");
          return;
        }
        entry = {
          name: name.trim(),
          walletAddress: walletAddress.trim(),
          avatar: generateAvatarUrl(selectedAvatarSeed, selectedAvatarStyle),
          avatarType: "avatar_seed",
          avatarSeed: selectedAvatarSeed,
          avatarStyle: selectedAvatarStyle,
        };
      } else {
        entry = {
          name: name.trim(),
          walletAddress: walletAddress.trim(),
          avatar: uploadedImage || "",
          avatarType: activeTab,
        };
      }

      await onSubmit(entry);

      // Reset form
      setName("");
      setWalletAddress("");
      setUploadedImage(null);
      setActiveTab("anime");
      setSelectedAvatarSeed(null);
      setAvatarOptions([]);
      setErrors({});
    } catch (error) {
      console.error("Error submitting waitlist entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

            {/* Avatar Selection */}
            <div className="space-y-3">
              <Label>Choose Your Avatar</Label>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "upload" | "anime")
                }
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20">
                  <TabsTrigger
                    value="anime"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Random Avatars
                  </TabsTrigger>
                  <TabsTrigger
                    value="upload"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="anime" className="space-y-1.5">
                  {/* Style Selection */}
                  <div className="space-y-1">
                    <Label className="text-sm text-white/80">
                      Avatar Style
                    </Label>
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5">
                      {Object.keys(AVATAR_STYLES).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() =>
                            handleStyleChange(style as AvatarStyle)
                          }
                          className={`px-2 py-0.5 sm:py-1 rounded-lg text-xs whitespace-nowrap transition-all font-medium flex-shrink-0 ${
                            selectedAvatarStyle === style
                              ? "bg-orange-500 text-white shadow-lg"
                              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {getStyleDisplayName(style as AvatarStyle)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar Options Grid */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-white/80">
                        Choose Avatar
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateNewAvatarOptions}
                        disabled={isGeneratingAvatars}
                        className="text-white/70 border-white/30 hover:bg-white/20 hover:text-white transition-all h-8 px-3"
                      >
                        <RefreshCw
                          className={`h-3 w-3 ${
                            isGeneratingAvatars ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 place-items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
                      {isGeneratingAvatars
                        ? // Loading skeletons
                          Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-16 h-16 bg-white/20 rounded-lg animate-pulse"
                            />
                          ))
                        : avatarOptions.map((seed) => (
                            <button
                              key={seed}
                              type="button"
                              onClick={() => setSelectedAvatarSeed(seed)}
                              className={`w-16 h-16 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                                selectedAvatarSeed === seed
                                  ? "ring-2 ring-orange-500 ring-offset-1 ring-offset-black/20"
                                  : "hover:ring-1 hover:ring-white/30"
                              }`}
                            >
                              <img
                                src={generateAvatarUrl(
                                  seed,
                                  selectedAvatarStyle,
                                  {
                                    backgroundColor: getRandomBackground(),
                                  }
                                )}
                                alt="Avatar option"
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </button>
                          ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-1.5">
                  <div className="border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center">
                    {uploadedImage ? (
                      <div className="space-y-1.5">
                        <img
                          src={uploadedImage}
                          alt="Uploaded avatar"
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto object-cover border-2 border-orange-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearUploadedImage}
                          className="text-white/70 border-white/30 hover:bg-white/20 hover:text-white transition-all text-xs sm:text-sm"
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white/50 mx-auto" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-white/70 border-white/30 hover:bg-white/20 hover:text-white transition-all text-xs sm:text-sm"
                          >
                            Choose Image
                          </Button>
                          <p className="text-xs sm:text-sm text-white/50 mt-0.5">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </TabsContent>
              </Tabs>
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
