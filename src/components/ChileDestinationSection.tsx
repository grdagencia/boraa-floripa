"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { UI } from "@/data/trip";
import { smoothScrollTo } from "@/lib/countdown";

export function ChileDestinationSection({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => {
      smoothScrollTo("chile", "start");
    }, 8000);
    return () => window.clearTimeout(id);
  }, [active]);

  if (!active) return null;

  return (
    <section
      id="chile"
      className="relative min-h-[100svh] overflow-hidden border-t border-white/10"
    >
      <HeroVideoBackground
        videos={UI.chileVideos}
        overlayClassName="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.78)_0%,rgba(0,0,0,.48)_45%,rgba(0,0,0,.86)_100%)]"
      />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="mb-5 text-xs font-black uppercase tracking-[0.35em] text-lime">
              Próximo capítulo
            </p>
            <h2 className="font-display text-[clamp(2.4rem,8vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-white [text-shadow:0_4px_40px_rgba(0,0,0,0.55)]">
              Agora já sabe o próximo destino né?
              <span className="mt-3 block text-coral">Chileeeeeee</span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Floripa foi o aquecimento. O Andes já está no radar. Guarda a energia — o
              próximo voo também é nosso.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
