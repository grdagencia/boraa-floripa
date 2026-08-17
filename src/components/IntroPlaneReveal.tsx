"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UI } from "@/data/trip";

type IntroPlaneRevealProps = {
  onComplete?: () => void;
};

export function IntroPlaneReveal({ onComplete }: IntroPlaneRevealProps) {
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
    }, UI.introDurationMs);

    return () => {
      window.clearTimeout(finishTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const dismiss = () => setVisible(false);

  const handleExitComplete = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Continuar"
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-black px-5 text-center"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-14%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl font-display text-[clamp(2.1rem,9vw,6.4rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-white"
          >
            Vai tomar no cu de mácio!!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-4xl font-display text-[clamp(1.05rem,4.2vw,2.35rem)] font-black uppercase leading-[1.05] tracking-[-0.03em] text-coral"
          >
            Aqui é pragmático pohaa cuiudo
          </motion.p>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
