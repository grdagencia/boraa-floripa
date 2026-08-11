"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MotivationalDay } from "@/data/motivationalCopy";

const FADE_DURATION = 1.6;

const fadeTransition = {
  duration: FADE_DURATION,
  ease: [0.4, 0, 0.2, 1] as const,
};

type HeroTitleBlockProps = {
  motivationalDay: MotivationalDay | null;
  message: string | null;
};

export function HeroTitleBlock({ motivationalDay, message }: HeroTitleBlockProps) {
  const titleKey =
    motivationalDay !== null && message ? `motivational-${motivationalDay}` : "default";

  return (
    <div className="min-h-[clamp(8rem,28vw,12rem)] lg:min-h-[clamp(10rem,32vw,14rem)]">
      <AnimatePresence mode="wait">
        {motivationalDay !== null && message ? (
          <motion.p
            key={titleKey}
            role="heading"
            aria-level={1}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={fadeTransition}
            className="font-display text-[clamp(1.05rem,2.6vw,1.75rem)] font-black leading-[1.38] tracking-[-0.025em] text-white sm:leading-[1.42]"
          >
            {message}
          </motion.p>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={fadeTransition}
          >
            <h1 className="font-display text-[clamp(4.2rem,11vw,9.5rem)] font-black uppercase leading-[0.78] tracking-[-0.065em] text-white">
              Let&apos;s go
              <span className="block text-outline">pohaaa</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type DefaultHeroSubtitleProps = {
  show: boolean;
};

export function DefaultHeroSubtitle({ show }: DefaultHeroSubtitleProps) {
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.div
          key="default-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ...fadeTransition, duration: FADE_DURATION * 0.85 }}
          className="mt-7 flex flex-wrap items-center gap-4"
        >
          <span className="rounded-full bg-lime px-5 py-2.5 text-sm font-black text-ink">
            # FLORIPA
          </span>
          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Trabalhar com propósito. Fazer dinheiro com coragem. Voltar para a ilha com a vida
            que a gente escolheu.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
