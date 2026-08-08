"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, MapPin, Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { TRIP, UI } from "@/data/trip";
import { getTimeLeft, type TimeLeft } from "@/lib/countdown";

const LAST_DAYS_KEY = "floripa-last-days";

function CountdownTimer({ time }: { time: TimeLeft }) {
  const urgent = !time.finished && time.days <= UI.urgentDaysThreshold;
  const units = [
    ["Dias", time.days],
    ["Horas", time.hours],
    ["Min", time.minutes],
    ["Seg", time.seconds],
  ] as const;

  if (time.finished) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl border border-lime/30 bg-lime/10 px-6 py-8 text-center text-2xl font-black text-lime sm:text-4xl"
      >
        CHEGOU O DIA. PARTIU FLORIPA! 🌴✈️
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-label="Contagem regressiva">
      {units.map(([label, value], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.08 }}
          className={`rounded-2xl px-2 py-4 text-center sm:rounded-3xl sm:px-5 sm:py-6 ${
            urgent
              ? "border border-red-500/40 bg-red-600/20 shadow-[0_0_30px_rgba(220,38,38,0.25)]"
              : "glass"
          }`}
        >
          <strong
            className={`block font-display text-3xl font-black tabular-nums sm:text-6xl ${
              urgent ? "text-red-400" : "text-white"
            }`}
          >
            {String(value).padStart(2, "0")}
          </strong>
          <span
            className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs ${
              urgent ? "text-red-300/80" : "text-white/55"
            }`}
          >
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DaysRemainingCard({ time }: { time: TimeLeft }) {
  const totalDays = time.finished ? 0 : time.days;
  const urgent = !time.finished && time.days <= UI.urgentDaysThreshold;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.85 }}
      className={`mt-5 flex items-center justify-between rounded-2xl border px-5 py-4 backdrop-blur-xl ${
        urgent
          ? "border-red-500/35 bg-red-600/15"
          : "border-white/10 bg-white/[0.06]"
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          Próximo destino · voo {TRIP.displayTime}
        </p>
        <p className={`mt-1 text-lg font-bold ${urgent ? "text-red-300" : "text-white"}`}>
          {time.finished
            ? "Floripa é agora!"
            : totalDays === 1
              ? "Falta 1 dia para Floripa"
              : `Faltam ${totalDays} dias para Floripa`}
        </p>
      </div>
      <div
        className={`grid size-11 place-items-center rounded-full text-ink shadow-lg ${
          urgent ? "bg-red-500 shadow-red-500/30" : "bg-coral shadow-coral/20"
        }`}
      >
        <MapPin size={20} />
      </div>
    </motion.div>
  );
}

export function HeroCountdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [dayAlert, setDayAlert] = useState<number | null>(null);
  const primedDays = useRef(false);

  useEffect(() => {
    const update = () => {
      const next = getTimeLeft(TRIP.targetDate);
      setTime(next);

      if (next.finished) return;

      if (!primedDays.current) {
        primedDays.current = true;
        try {
          const stored = window.localStorage.getItem(LAST_DAYS_KEY);
          if (stored === null) {
            window.localStorage.setItem(LAST_DAYS_KEY, String(next.days));
          } else {
            const previous = Number(stored);
            if (Number.isFinite(previous) && next.days < previous) {
              setDayAlert(next.days);
              window.localStorage.setItem(LAST_DAYS_KEY, String(next.days));
              window.setTimeout(() => setDayAlert(null), 6500);
            } else if (next.days !== previous) {
              window.localStorage.setItem(LAST_DAYS_KEY, String(next.days));
            }
          }
        } catch {
          // storage bloqueado
        }
        return;
      }

      try {
        const stored = window.localStorage.getItem(LAST_DAYS_KEY);
        const previous = stored === null ? null : Number(stored);
        if (previous !== null && Number.isFinite(previous) && next.days < previous) {
          setDayAlert(next.days);
          window.localStorage.setItem(LAST_DAYS_KEY, String(next.days));
          window.setTimeout(() => setDayAlert(null), 6500);
        } else if (previous !== next.days) {
          window.localStorage.setItem(LAST_DAYS_KEY, String(next.days));
        }
      } catch {
        // ignore
      }
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="hero relative min-h-[100svh] overflow-hidden">
      <HeroVideoBackground />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between">
          <a
            href="#inicio"
            className="flex items-center gap-2 text-sm font-black tracking-[0.18em] text-white"
          >
            <Plane className="text-coral" size={18} /> FLN / 2026
          </a>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            15 AGO · {TRIP.displayTime}
          </span>
        </nav>

        <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-coral"
            >
              <span className="h-px w-9 bg-coral" /> Operação volta pra ilha
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="font-display text-[clamp(4.2rem,11vw,9.5rem)] font-black uppercase leading-[0.78] tracking-[-0.065em] text-white"
            >
              Let&apos;s go
              <span className="block text-outline">pohaaa</span>
            </motion.h1>

            <AnimatePresence mode="wait">
              {dayAlert !== null ? (
                <motion.p
                  key={dayAlert}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55 }}
                  className="mt-5 font-display text-[clamp(1.6rem,4vw,2.8rem)] font-black uppercase tracking-[-0.04em] text-lime"
                >
                  {dayAlert === 1
                    ? "Falta 1 dia. A ilha está perto."
                    : `Faltam ${dayAlert} dias. O relógio aperta.`}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-7 flex flex-wrap items-center gap-4"
            >
              <span className="rounded-full bg-lime px-5 py-2.5 text-sm font-black text-ink">
                # FLORIPA
              </span>
              <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                Trabalhar com propósito. Fazer dinheiro com coragem. Voltar para a ilha com a vida que a gente escolheu.
              </p>
            </motion.div>
          </div>

          <div>
            {time ? (
              <>
                <CountdownTimer time={time} />
                <DaysRemainingCard time={time} />
              </>
            ) : (
              <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
            )}
          </div>
        </div>

        <a
          href="#passagem"
          className="flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
        >
          Começar a jornada <ArrowDown className="animate-bounce" size={16} />
        </a>
      </div>
    </section>
  );
}
