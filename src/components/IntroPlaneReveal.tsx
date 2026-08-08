"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UI } from "@/data/trip";

type IntroPlaneRevealProps = {
  onComplete?: () => void;
};

export function IntroPlaneReveal({ onComplete }: IntroPlaneRevealProps) {
  const [visible, setVisible] = useState(true);
  const duration = UI.introDurationMs / 1000;
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
    }, UI.introDurationMs);

    return () => {
      window.clearTimeout(finishTimer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const handleExitComplete = () => {
    document.documentElement.style.overflow = "";
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,118,87,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(217,255,112,0.1),transparent_40%)]" />

          <motion.div
            className="absolute left-[-10%] top-[46%] h-px w-[120%] origin-left bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.8, 0.2] }}
            transition={{ duration, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute top-[36%] will-change-transform"
            initial={{ x: "-18vw", y: "4vh", rotate: -5, opacity: 1 }}
            animate={{
              x: ["-18vw", "12vw", "58vw", "122vw"],
              y: ["4vh", "1vh", "-3vh", "-8vh"],
              rotate: [-5, -2, 3, 6],
            }}
            transition={{
              duration,
              times: [0, 0.1, 0.55, 1],
              ease: "easeInOut",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={UI.planeImage}
              alt=""
              width={480}
              height={250}
              className="h-auto w-[min(58vw,460px)] max-w-none object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              draggable={false}
              fetchPriority="high"
            />
          </motion.div>

          <motion.p
            className="absolute inset-x-0 bottom-[18%] text-center text-xs font-black uppercase tracking-[0.35em] text-white/40"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 0], y: [8, 0, -6] }}
            transition={{ duration, times: [0, 0.25, 1], ease: "easeInOut" }}
          >
            Partindo para Floripa
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
