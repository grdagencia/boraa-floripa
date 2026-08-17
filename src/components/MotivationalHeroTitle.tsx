"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BH_IMPACT_COPY } from "@/data/motivationalCopy";

const fadeTransition = {
  duration: 1.35,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function DefaultHeroSubtitle({ show }: { show: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.div
          key="default-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
          className="mt-7 space-y-4"
        >
          <span className="inline-block rounded-full bg-lime px-5 py-2.5 text-sm font-black text-ink">
            # MODO CAVERNA
          </span>
          <p
            className="motivational-copy max-w-3xl font-display text-[clamp(0.95rem,2.1vw,1.22rem)] font-medium leading-[1.65] tracking-[-0.01em] text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]"
            dangerouslySetInnerHTML={{ __html: BH_IMPACT_COPY }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
