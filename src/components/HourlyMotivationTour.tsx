"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { TRIP } from "@/data/trip";
import {
  getTimeLeft,
  smoothScrollTo,
  TOUR_EVENTS,
  wait,
  waitForWindowEvent,
} from "@/lib/countdown";

const LAST_TOUR_KEY = "floripa-last-hour-tour";
const TOUR_LOCK_EVENT = "floripa:tour-lock";

type Overlay = { kind: "caption"; text: string } | null;

function dispatchMissions(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.missions, { detail }));
}

function dispatchIphone(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.iphone, { detail }));
}

function dispatchVideos(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.videos, { detail }));
}

function setTourLock(locked: boolean) {
  window.dispatchEvent(
    new CustomEvent(TOUR_LOCK_EVENT, { detail: { locked } }),
  );
}

export function HourlyMotivationTour({ enabled }: { enabled: boolean }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const running = useRef(false);
  const primed = useRef(false);
  const lastHours = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runTour = useCallback(async (controller: AbortController) => {
    if (running.current) return;
    running.current = true;
    setTourLock(true);

    try {
      smoothScrollTo("inicio");
      setOverlay({
        kind: "caption",
        text: "Mais uma hora passou. Modo caverna ligado. BH não espera moleza.",
      });
      await wait(2800, controller.signal);

      setOverlay({
        kind: "caption",
        text: "Assiste os 6. Sem pular. Scroll travado até o último acabar.",
      });
      smoothScrollTo("videos-obrigatorios", "center");
      await wait(700, controller.signal);
      const videosDone = waitForWindowEvent(
        TOUR_EVENTS.videosAllWatched,
        controller.signal,
      );
      dispatchVideos({ action: "focus" });
      setOverlay(null);
      await videosDone;

      setOverlay({
        kind: "caption",
        text: "Agora vai trabalhar.",
      });
      smoothScrollTo("xingamento", "center");
      await wait(4200, controller.signal);
      setOverlay(null);

      setOverlay({
        kind: "caption",
        text: "Única coisa pra marcar. Liberdade.",
      });
      smoothScrollTo("missoes");
      await wait(2400, controller.signal);
      setOverlay(null);
      dispatchMissions({ action: "highlight", durationMs: 5000 });
      await wait(5200, controller.signal);

      setOverlay({
        kind: "caption",
        text: "E a meta? Pega essa porra desse celular.",
      });
      smoothScrollTo("meta", "center");
      await wait(900, controller.signal);
      dispatchIphone({ action: "spin" });
      await Promise.race([
        waitForWindowEvent(TOUR_EVENTS.iphoneSpinDone, controller.signal),
        wait(5200, controller.signal),
      ]);
      setOverlay(null);
      await wait(500, controller.signal);

      setOverlay({
        kind: "caption",
        text: "Conselho da caverna.",
      });
      smoothScrollTo("conselho", "center");
      await wait(30_000, controller.signal);
      setOverlay(null);

      smoothScrollTo("final");
      setOverlay({
        kind: "caption",
        text: "Sai da casa do Norb. 15 segundos e voltamos pro topo.",
      });
      await wait(15_000, controller.signal);
      setOverlay(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      await wait(2000, controller.signal);
    } catch {
      // Abortado no unmount.
    } finally {
      setOverlay(null);
      dispatchMissions({ action: "clear" });
      dispatchVideos({ action: "unlock" });
      setTourLock(false);
      running.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();
    abortRef.current = controller;

    const start = () => {
      void runTour(controller);
    };

    const onManual = () => start();
    window.addEventListener(TOUR_EVENTS.runTour, onManual);

    const tick = () => {
      const time = getTimeLeft(TRIP.targetDate);
      if (time.finished) return;

      if (!primed.current) {
        primed.current = true;
        lastHours.current = time.hours;

        if (new URLSearchParams(window.location.search).has("tour")) {
          void (async () => {
            try {
              await wait(900, controller.signal);
              start();
            } catch {
              // abort
            }
          })();
        }
        return;
      }

      if (lastHours.current === null) {
        lastHours.current = time.hours;
        return;
      }

      if (time.hours !== lastHours.current) {
        const tourKey = `${time.days}-${time.hours}`;
        const already =
          window.sessionStorage.getItem(LAST_TOUR_KEY) === tourKey;

        lastHours.current = time.hours;

        if (!already && !running.current && !reduced) {
          window.sessionStorage.setItem(LAST_TOUR_KEY, tourKey);
          start();
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      controller.abort();
      window.clearInterval(id);
      window.removeEventListener(TOUR_EVENTS.runTour, onManual);
      setTourLock(false);
    };
  }, [enabled, runTour]);

  return (
    <>
      <AnimatePresence>
        {overlay ? (
          <motion.div
            key={overlay.text}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-5"
          >
            <p className="max-w-3xl rounded-full border border-white/15 bg-ink/55 px-6 py-3 text-center text-sm font-bold tracking-[0.04em] text-white shadow-2xl backdrop-blur-md sm:text-base">
              {overlay.text}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event(TOUR_EVENTS.runTour));
        }}
        className="fixed bottom-4 right-4 z-50 rounded bg-red-600 px-3 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-white shadow-lg"
      >
        Testar scroll automático
      </button>
    </>
  );
}
