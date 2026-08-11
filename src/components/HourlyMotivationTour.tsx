"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

type Overlay =
  | { kind: "caption"; text: string }
  | { kind: "jurere" }
  | null;

function dispatchAirbnb(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.airbnb, { detail }));
}

function dispatchMissions(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.missions, { detail }));
}

function dispatchTicket(detail: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(TOUR_EVENTS.ticket, { detail }));
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

  useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();

    const runTour = async () => {
      if (running.current || reduced) return;
      running.current = true;
      setTourLock(true);

      try {
        dispatchAirbnb({ action: "pause" });

        // Começa no timer (não só no topo), para landscape no celular.
        smoothScrollTo("timer", "center");
        setOverlay({
          kind: "caption",
          text: "Mais uma hora passou. Hora de lembrar por que estamos fazendo isso.",
        });
        await wait(3200, controller.signal);

        setOverlay({
          kind: "caption",
          text: "A passagem está marcada. A ilha não espera quem fica parado.",
        });
        smoothScrollTo("passagem-card", "center");
        await wait(1600, controller.signal);
        dispatchTicket({ action: "interact" });
        await waitForWindowEvent(TOUR_EVENTS.ticketDone, controller.signal);
        await wait(600, controller.signal);

        setOverlay({
          kind: "caption",
          text: "Olhando as bases… a ilha está pedindo presença.",
        });

        // Já começa a girar antes de chegar — ao chegar já está no ritmo.
        dispatchAirbnb({ action: "spinToPreferred", fastMs: 5000 });
        await wait(120, controller.signal);
        smoothScrollTo("airbnb-stage", "center");
        await waitForWindowEvent(TOUR_EVENTS.airbnbSpinDone, controller.signal);
        setOverlay(null);

        setOverlay({
          kind: "caption",
          text: "Esse aqui… Jurerê. Nossa primeira escolha.",
        });
        await wait(2800, controller.signal);

        setOverlay({ kind: "jurere" });
        await wait(4500, controller.signal);
        setOverlay(null);
        await wait(700, controller.signal);

        dispatchAirbnb({ action: "resume" });
        setOverlay({
          kind: "caption",
          text: "Agora as missões. O que ainda falta fazer?",
        });
        smoothScrollTo("missoes");
        await wait(2400, controller.signal);
        setOverlay(null);

        dispatchMissions({ action: "highlight", durationMs: 7000 });
        await wait(7200, controller.signal);

        smoothScrollTo("final");
        setOverlay({
          kind: "caption",
          text: "O relógio corre. Floripa espera. Bora fazer acontecer.",
        });
        await wait(3800, controller.signal);
        setOverlay(null);

        await wait(1200, controller.signal);
        // Volta focando o timer (importante no celular landscape).
        smoothScrollTo("timer", "center");
        await wait(2000, controller.signal);
      } catch {
        // Abortado no unmount.
      } finally {
        setOverlay(null);
        dispatchAirbnb({ action: "resume" });
        dispatchMissions({ action: "clear" });
        setTourLock(false);
        running.current = false;
      }
    };

    const tick = () => {
      const time = getTimeLeft(TRIP.targetDate);
      if (time.finished) return;

      if (!primed.current) {
        primed.current = true;
        lastHours.current = time.hours;

        // Teste manual: ?tour=1 — só depois da intro (este effect só roda com enabled).
        if (new URLSearchParams(window.location.search).has("tour")) {
          // Pequena pausa para a saída do avião terminar de sumir.
          void (async () => {
            try {
              await wait(900, controller.signal);
              await runTour();
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

        if (!already && !running.current) {
          window.sessionStorage.setItem(LAST_TOUR_KEY, tourKey);
          void runTour();
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      controller.abort();
      window.clearInterval(id);
      setTourLock(false);
    };
  }, [enabled]);

  return (
    <AnimatePresence>
      {overlay ? (
        <motion.div
          key={overlay.kind === "jurere" ? "jurere" : overlay.text}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 top-[18%] z-[95] flex justify-center px-5"
        >
          {overlay.kind === "jurere" ? (
            <p className="max-w-5xl text-center font-display text-[clamp(2.4rem,8vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-lime drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
              BORAA PARA JURERÊ
              <span className="mt-2 block text-coral">CARALHOOO!!!</span>
            </p>
          ) : (
            <p className="max-w-3xl rounded-full border border-white/15 bg-ink/55 px-6 py-3 text-center text-sm font-bold tracking-[0.04em] text-white shadow-2xl backdrop-blur-md sm:text-base">
              {overlay.text}
            </p>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
