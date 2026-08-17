"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { TOUR_EVENTS } from "@/lib/countdown";

const STORAGE_KEY = "bh-missions-liberdade-v1";
const CHANGE_EVENT = "floripa-missions-change";
const MISSION_ID = "liberdade";
const EMPTY_COMPLETED: string[] = [];
let cachedStorageValue: string | null = null;
let cachedCompleted = EMPTY_COMPLETED;

function getCompletedSnapshot() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === cachedStorageValue) return cachedCompleted;

  cachedStorageValue = stored;
  try {
    const parsed = stored ? JSON.parse(stored) : [];
    cachedCompleted = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY_COMPLETED;
  } catch {
    cachedCompleted = EMPTY_COMPLETED;
  }
  return cachedCompleted;
}

function getServerSnapshot() {
  return EMPTY_COMPLETED;
}

function subscribeToMissions(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function PaginatedChecklist() {
  const completed = useSyncExternalStore(
    subscribeToMissions,
    getCompletedSnapshot,
    getServerSnapshot,
  );
  const [tourHighlight, setTourHighlight] = useState(false);
  const done = completed.includes(MISSION_ID);

  useEffect(() => {
    const onTour = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        action?: string;
        durationMs?: number;
      };
      if (detail?.action === "highlight") {
        setTourHighlight(true);
        window.setTimeout(
          () => setTourHighlight(false),
          detail.durationMs ?? 5000,
        );
      }
      if (detail?.action === "clear") {
        setTourHighlight(false);
      }
    };
    window.addEventListener(TOUR_EVENTS.missions, onTour);
    return () => window.removeEventListener(TOUR_EVENTS.missions, onTour);
  }, []);

  const toggle = () => {
    const next = done ? [] : [MISSION_ID];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // ignore
    }
  };

  return (
    <section
      id="missoes"
      className="section-pad relative overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,118,87,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-12">
        <h2 className="font-display text-[clamp(1.7rem,5.5vw,4.2rem)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-white">
          ÚNICA COISA PRA SER MARCADA URGENTEMENTE.
        </h2>

        <motion.label
          animate={
            tourHighlight
              ? {
                  y: [0, -14, 0, 10, 0],
                  rotate: [0, -2.8, 2.8, -1.6, 0],
                  scale: [1, 1.06, 0.98, 1.04, 1],
                  boxShadow: [
                    "0 0 0 rgba(255,26,26,0)",
                    "0 0 48px rgba(255,26,26,0.45)",
                    "0 0 0 rgba(255,26,26,0)",
                  ],
                }
              : {
                  y: [0, -10, 2, 8, 0],
                  rotate: [-1.4, 1.5, -0.9, 1.2, -1.4],
                  scale: [1, 1.03, 1, 1.02, 1],
                }
          }
          transition={{
            duration: tourHighlight ? 0.7 : 2.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`mx-auto mt-16 flex w-full max-w-4xl cursor-pointer items-center justify-center gap-8 rounded-[2rem] border px-8 py-12 sm:gap-12 sm:px-14 sm:py-16 ${
            done
              ? "border-lime/40 bg-lime/10"
              : "border-white/10 bg-white/[0.03] hover:border-coral/40"
          }`}
        >
          <input
            type="checkbox"
            checked={done}
            onChange={toggle}
            aria-label="LIBERDADE."
            className="size-8 shrink-0 origin-center cursor-pointer accent-lime scale-[2.4] sm:size-10 sm:scale-[3.2]"
          />
          <span
            className={`font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl md:text-7xl ${
              done ? "text-lime" : "text-white"
            }`}
          >
            LIBERDADE.
          </span>
        </motion.label>
      </div>
    </section>
  );
}
