"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useThreeGlobe } from "@/components/globe/useThreeGlobe";
import WaitlistPopup from "@/components/waitlist/waitlist-popup";
import waitlistService, { WaitlistEntry } from "@/lib/waitlist-service";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const GlobeCanvas: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isWaitlistPopupOpen, setWaitlistPopupOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistEntries, setWaitlistEntries] = useState<
    Map<number, WaitlistEntry>
  >(new Map());
  const [alreadyJoined, setAlreadyJoined] = useState<boolean>(false);

  const getEntryByProfileId = useMemo(
    () => (id: number) => waitlistEntries.get(id),
    [waitlistEntries]
  );

  const { mountRef, loading, loadingProgress, tooltip, applyEntryToGlobe } =
    useThreeGlobe(waitlistEntries, {
      onEmptySpotClick: (profileId) => {
        if (alreadyJoined) {
          setWaitlistError("You have already joined the waitlist.");
          return;
        }
        setSelectedProfileId(profileId);
        setWaitlistPopupOpen(true);
        setWaitlistError(null);
      },
      getEntryByProfileId,
    });

  const handleWaitlistSubmit = async (entryData: {
    name: string;
    walletAddress: string;
    avatar: string;
    avatarType: "upload" | "avatar_seed";
    avatarSeed?: string;
    avatarStyle?: string;
  }) => {
    try {
      setWaitlistError(null);
      if (selectedProfileId === null) throw new Error("No profile selected");

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...entryData, profileId: selectedProfileId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      const data = await res.json();

      const entry: WaitlistEntry = {
        id: data.id,
        name: data.name,
        walletAddress: data.wallet_address,
        avatar: data.avatar,
        avatarType: data.avatar_type,
        avatarSeed: data.avatar_seed,
        avatarStyle: data.avatar_style,
        profileId: data.profile_id,
        timestamp: new Date(data.created_at ?? Date.now()).getTime(),
      };

      applyEntryToGlobe(entry);
      setWaitlistEntries((prev) => {
        const newEntries = new Map(prev);
        newEntries.set(entry.profileId, entry);
        return newEntries;
      });
      setWaitlistPopupOpen(false);
      setSelectedProfileId(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to join waitlist";
      setWaitlistError(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const allEntries = await waitlistService.getAllEntries();
        const entriesMap = new Map<number, WaitlistEntry>();
        allEntries.forEach((entry) => entriesMap.set(entry.profileId, entry));
        setWaitlistEntries(entriesMap);
        // Check current user status
        const res = await fetch("/api/waitlist/me", { cache: "no-store" });
        if (res.ok) {
          const { entry } = await res.json();
          setAlreadyJoined(!!entry);
        }
      } catch (error) {
        console.error("Failed to load waitlist entries:", error);
      }
    };
    loadEntries();
  }, []);

  // Apply existing entries once the scene is mounted and entries are present
  useEffect(() => {
    if (waitlistEntries.size === 0) return;
    // Defer to next frame to ensure meshes exist
    const id = requestAnimationFrame(() => {
      waitlistEntries.forEach((entry) => applyEntryToGlobe(entry));
    });
    return () => cancelAnimationFrame(id);
  }, [waitlistEntries, applyEntryToGlobe]);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab globe-container touch-optimized"
        style={{ userSelect: "none" }}
      />

      {loading && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[1000] px-4">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 173 173"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 md:w-12 md:h-12"
              >
                <path
                  d="M87.8752 75.3753L50.8259 38.326L39.6267 49.5252L76.4744 86.3729L39.6267 123.221L49.9753 133.569L87.8752 95.6693L125.775 133.569L136.124 123.221L99.276 86.3729L136.124 49.5252L124.924 38.326L87.8752 75.3753Z"
                  fill="#F97316"
                />
                <path
                  d="M59.096 29.3139L87.8752 0.534729L116.654 29.3139L87.8752 58.0931L59.096 29.3139Z"
                  fill="#F97316"
                />
                <path
                  d="M115.292 86.5213L144.072 57.7421L172.851 86.5213L144.072 115.3L115.292 86.5213Z"
                  fill="#F97316"
                />
                <path
                  d="M0.467819 86.5213L29.247 57.7421L58.0262 86.5213L29.247 115.3L0.467819 86.5213Z"
                  fill="#F97316"
                />
                <path
                  d="M59.096 143.506L68.6725 133.929L88.3285 152.348L97.7593 142.694L88.1019 133.15L87.8752 114.727L116.654 143.506L87.8752 172.285L59.096 143.506Z"
                  fill="#F97316"
                />
              </svg>
              <span className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                AXIOS
              </span>
            </div>
          </div>
          <div className="w-full max-w-sm md:max-w-md mb-6">
            <div className="relative">
              <div className="w-full h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-center mt-3 md:mt-4">
                <span className="text-white text-xs md:text-sm font-medium">
                  {Math.round(loadingProgress)}% COMPLETE
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse delay-75" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}

      <div
        className="absolute bg-black/90 text-white px-3 py-2 rounded-md text-xs pointer-events-none z-[1000] border border-orange-500/50 transition-opacity duration-300"
        style={{
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          opacity: tooltip.visible ? 1 : 0,
        }}
        dangerouslySetInnerHTML={{ __html: tooltip.content }}
      />

      <WaitlistPopup
        isOpen={isWaitlistPopupOpen}
        onClose={() => {
          setWaitlistPopupOpen(false);
          setSelectedProfileId(null);
          setWaitlistError(null);
        }}
        onSubmit={handleWaitlistSubmit}
        profileId={selectedProfileId}
      />

      {waitlistError && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-[10000]">
          {waitlistError}
        </div>
      )}

      {/* Join Waitlist Button - bottom center with glowing border (shows only after loading) */}
      {!loading && (
        <div className="absolute inset-x-0 bottom-4 md:bottom-6 z-[1100] flex justify-center px-4 pointer-events-none">
          <div className="relative group pointer-events-auto">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <Button
              onClick={() => {
                if (alreadyJoined) {
                  setWaitlistError("You have already joined the waitlist.");
                  return;
                }
                const configured = Number(
                  process.env.NEXT_PUBLIC_WAITLIST_MAX_SPOTS || 250
                );
                const MAX_SPOTS = Math.max(
                  200,
                  Math.min(300, isFinite(configured) ? configured : 250)
                );
                // Pick the first available spot from 1..MAX_SPOTS
                let chosen: number | null = null;
                for (let i = 1; i <= MAX_SPOTS; i++) {
                  if (!waitlistEntries.has(i)) {
                    chosen = i;
                    break;
                  }
                }
                if (!chosen) {
                  setWaitlistError("No available spots at the moment.");
                  return;
                }
                setSelectedProfileId(chosen);
                setWaitlistPopupOpen(true);
                setWaitlistError(null);
              }}
              className="relative bg-black/70 hover:bg-black/60 text-white border border-orange-500/50 px-3 md:px-4 py-2 h-8 md:h-9 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] text-sm md:text-base"
              size="sm"
            >
              Join waitlist
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeCanvas;
