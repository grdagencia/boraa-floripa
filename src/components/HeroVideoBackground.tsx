"use client";

import { useEffect, useRef } from "react";
import { UI } from "@/data/trip";

type HeroVideoBackgroundProps = {
  videos?: string[];
  className?: string;
  overlayClassName?: string;
};

/**
 * Playlist suave com 2 players:
 * - um toca o vídeo atual
 * - o outro pré-carrega o próximo
 * - no fim, faz crossfade e troca
 */
export function HeroVideoBackground({
  videos = UI.heroVideos,
  className = "absolute inset-0 h-full w-full object-cover will-change-[opacity]",
  overlayClassName = "absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,23,.88)_0%,rgba(5,18,23,.55)_55%,rgba(5,18,23,.28)_100%)]",
}: HeroVideoBackgroundProps) {
  const rate = UI.heroVideoPlaybackRate;
  const fadeMs = UI.heroVideoCrossfadeMs;

  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const indexRef = useRef(0);
  const activeSlotRef = useRef<"a" | "b">("a");
  const fadingRef = useRef(false);

  useEffect(() => {
    if (!videos.length) return;

    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    indexRef.current = 0;
    activeSlotRef.current = "a";
    fadingRef.current = false;

    const prepare = (el: HTMLVideoElement, src: string) => {
      el.playbackRate = rate;
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      el.loop = false;
      el.preload = "auto";
      if (el.dataset.src !== src) {
        el.dataset.src = src;
        el.src = src;
        el.load();
      }
    };

    const playSafe = (el: HTMLVideoElement) => {
      el.playbackRate = rate;
      void el.play().catch(() => {
        // Autoplay pode falhar; muted+playsInline cobre a maioria.
      });
    };

    const nextIndex = (from: number) => (from + 1) % videos.length;
    const getActive = () => (activeSlotRef.current === "a" ? a : b);
    const getIdle = () => (activeSlotRef.current === "a" ? b : a);

    prepare(a, videos[0]);
    prepare(b, videos[nextIndex(0)]);
    a.style.opacity = "1";
    b.style.opacity = "0";
    a.style.transition = "none";
    b.style.transition = "none";
    playSafe(a);

    const preloadNext = () => {
      const idle = getIdle();
      prepare(idle, videos[nextIndex(indexRef.current)]);
    };

    const goNext = async () => {
      if (fadingRef.current) return;
      fadingRef.current = true;

      const active = getActive();
      const idle = getIdle();
      const upcomingIndex = nextIndex(indexRef.current);

      prepare(idle, videos[upcomingIndex]);
      try {
        idle.currentTime = 0;
      } catch {
        // ignore seek errors while loading
      }
      playSafe(idle);

      await new Promise<void>((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          idle.removeEventListener("playing", finish);
          idle.removeEventListener("canplay", finish);
          window.clearTimeout(timer);
          resolve();
        };
        const timer = window.setTimeout(finish, 700);
        if (idle.readyState >= 3) {
          finish();
          return;
        }
        idle.addEventListener("playing", finish, { once: true });
        idle.addEventListener("canplay", finish, { once: true });
      });

      idle.style.transition = `opacity ${fadeMs}ms ease`;
      active.style.transition = `opacity ${fadeMs}ms ease`;
      void idle.offsetWidth;
      idle.style.opacity = "1";
      active.style.opacity = "0";

      await new Promise((r) => window.setTimeout(r, fadeMs + 50));

      active.pause();
      try {
        active.currentTime = 0;
      } catch {
        // ignore
      }

      indexRef.current = upcomingIndex;
      activeSlotRef.current = activeSlotRef.current === "a" ? "b" : "a";
      fadingRef.current = false;
      preloadNext();
    };

    const onEnded = () => {
      void goNext();
    };

    const onTimeUpdate = (event: Event) => {
      const el = event.currentTarget as HTMLVideoElement;
      if (fadingRef.current) return;
      if (el !== getActive()) return;
      if (!el.duration || !Number.isFinite(el.duration)) return;
      if (el.duration - el.currentTime <= fadeMs / 1000 + 0.08) {
        void goNext();
      }
    };

    a.addEventListener("ended", onEnded);
    b.addEventListener("ended", onEnded);
    a.addEventListener("timeupdate", onTimeUpdate);
    b.addEventListener("timeupdate", onTimeUpdate);

    const prefetchLinks = videos.slice(1).map((src) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "video";
      link.href = src;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      a.removeEventListener("timeupdate", onTimeUpdate);
      b.removeEventListener("timeupdate", onTimeUpdate);
      a.pause();
      b.pause();
      prefetchLinks.forEach((link) => link.remove());
    };
  }, [videos, rate, fadeMs]);

  if (!videos.length) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-[#07191D] via-teal/40 to-[#1a0a08]" />
        <div className={overlayClassName} />
        <div className="noise absolute inset-0 opacity-25" />
      </>
    );
  }

  return (
    <>
      <video
        ref={aRef}
        className={className}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <video
        ref={bRef}
        className={className}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className={overlayClassName} />
      <div className="noise absolute inset-0 opacity-25" />
    </>
  );
}
