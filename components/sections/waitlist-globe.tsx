"use client";

import React, { useState, useEffect, useRef } from "react";
import GlobeCanvas from "@/components/globe/GlobeCanvas";

const MUSIC_PREF_KEY = "waitlist_music_enabled";

export default function WaitlistSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element and events (no autoplay)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.3;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // If user previously opted-in, start on first interaction
    const prefEnabled = (() => {
      try {
        return localStorage.getItem(MUSIC_PREF_KEY) === "1";
      } catch {
        return false;
      }
    })();

    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      if (prefEnabled && audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    if (prefEnabled) {
      document.addEventListener("pointerdown", handleFirstInteraction, {
        once: true,
      });
    }

    return () => {
      if (prefEnabled) {
        document.removeEventListener("pointerdown", handleFirstInteraction);
      }
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      try {
        localStorage.setItem(MUSIC_PREF_KEY, "0");
      } catch {}
    } else {
      audio
        .play()
        .then(() => {
          try {
            localStorage.setItem(MUSIC_PREF_KEY, "1");
          } catch {}
        })
        .catch(() => {
          // Playback failed (likely gesture needed). Ensure pref not set.
          try {
            localStorage.setItem(MUSIC_PREF_KEY, "0");
          } catch {}
        });
    }
  };

  return (
    <div
      id="waitlist-section"
      className="relative w-full bg-background text-foreground overflow-hidden"
    >
      {/* Hidden audio element for reliable mobile playback */}
      <audio
        ref={audioRef}
        src="/audio/waitlist.mp3"
        preload="auto"
        playsInline
        className="hidden"
      />
      {/* Hero Section with 3D Globe - Fixed Height */}
      <div className="h-screen relative">
        {/* 3D Globe Background */}
        <div className="absolute inset-0 z-0">
          <GlobeCanvas />
        </div>

        {/* Gradient Overlay (let pointer events pass through) */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-background/10 to-transparent z-10 pointer-events-none" />

        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 pointer-events-none">
          <div className="flex items-center space-x-1 md:space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 173 173"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-8 md:h-8"
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
            <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
              AXIOS
            </span>
          </div>
        </div>

        {/* Music Control Button - Top Right */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <button
            onClick={toggleMusic}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? (
              // Pause Icon
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white group-hover:scale-110 transition-transform md:w-4 md:h-4"
              >
                <rect
                  x="6"
                  y="4"
                  width="4"
                  height="16"
                  fill="currentColor"
                  rx="1"
                />
                <rect
                  x="14"
                  y="4"
                  width="4"
                  height="16"
                  fill="currentColor"
                  rx="1"
                />
              </svg>
            ) : (
              // Play Icon
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white group-hover:scale-110 transition-transform ml-0.5 md:w-4 md:h-4"
              >
                <path d="M8 5.14v13.72L19 12 8 5.14z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
