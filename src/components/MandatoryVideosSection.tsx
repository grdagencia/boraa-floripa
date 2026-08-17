"use client";

import { useEffect, useRef, useState } from "react";
import { UI } from "@/data/trip";
import { TOUR_EVENTS } from "@/lib/countdown";

let scrollLocked = false;
let lockedY = 0;

function lockPageScroll() {
  if (scrollLocked) return;
  scrollLocked = true;
  lockedY = window.scrollY;
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.touchAction = "none";
}

function unlockPageScroll() {
  if (!scrollLocked) return;
  scrollLocked = false;
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.touchAction = "";
  window.scrollTo(0, lockedY);
}

export function MandatoryVideosSection() {
  const videos = UI.caveVideos;
  const [index, setIndex] = useState(0);
  const [tourLock, setTourLock] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const autoplayRef = useRef(false);

  indexRef.current = index;
  lockRef.current = tourLock;

  const playCurrent = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {
      // Autoplay com som pode exigir toque no controle.
    });
  };

  useEffect(() => {
    const onTour = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string }>).detail;

      if (detail?.action === "unlock") {
        lockRef.current = false;
        autoplayRef.current = false;
        setTourLock(false);
        videoRef.current?.pause();
        unlockPageScroll();
        return;
      }

      if (detail?.action !== "focus") return;

      lockRef.current = true;
      autoplayRef.current = true;
      setTourLock(true);
      setIndex(0);
      indexRef.current = 0;
      lockPageScroll();
      window.setTimeout(() => playCurrent(), 80);
    };

    window.addEventListener(TOUR_EVENTS.videos, onTour);
    return () => {
      window.removeEventListener(TOUR_EVENTS.videos, onTour);
      unlockPageScroll();
    };
  }, []);

  useEffect(() => {
    if (!tourLock) return;

    const block = (e: Event) => {
      e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(
          e.key,
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [tourLock]);

  const onEnded = () => {
    const current = indexRef.current;

    if (current < videos.length - 1) {
      autoplayRef.current = true;
      const next = current + 1;
      indexRef.current = next;
      setIndex(next);
      return;
    }

    autoplayRef.current = false;
    if (!lockRef.current) return;

    lockRef.current = false;
    setTourLock(false);
    unlockPageScroll();
    window.dispatchEvent(new Event(TOUR_EVENTS.videosAllWatched));
  };

  return (
    <section
      id="videos-obrigatorios"
      className="relative min-h-[100svh] overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,118,87,0.12),transparent_50%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
        <h2 className="mx-auto mb-10 max-w-5xl text-center font-display text-[clamp(1.8rem,5.5vw,4.4rem)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-white">
          Assiste essa pohha, se inspira e faz o{" "}
          <span className="text-coral">caixa girar</span>, cuiudo.
        </h2>

        <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.22em] text-white/45">
          {tourLock
            ? `C${index + 1} de ${videos.length} · scroll travado até o fim`
            : `C${index + 1} / ${videos.length}`}
        </p>

        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.85)]">
          <video
            ref={videoRef}
            src={videos[index]}
            controls
            playsInline
            preload="auto"
            className="aspect-[9/16] h-auto w-full bg-black object-cover"
            onEnded={onEnded}
            onLoadedData={() => {
              if (lockRef.current || autoplayRef.current) playCurrent();
            }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
            C{index + 1}
          </span>
        </div>
      </div>
    </section>
  );
}
