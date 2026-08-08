"use client";

import { useEffect, useRef } from "react";
import { UI } from "@/data/trip";

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = UI.heroVideoPlaybackRate;
    const play = () => {
      video.playbackRate = UI.heroVideoPlaybackRate;
      void video.play().catch(() => {
        // Autoplay pode falhar em alguns browsers; muted+playsInline cobre a maioria.
      });
    };
    play();
    video.addEventListener("loadedmetadata", play);
    return () => video.removeEventListener("loadedmetadata", play);
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={UI.heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,23,.88)_0%,rgba(5,18,23,.55)_55%,rgba(5,18,23,.28)_100%)]" />
      <div className="noise absolute inset-0 opacity-25" />
    </>
  );
}
