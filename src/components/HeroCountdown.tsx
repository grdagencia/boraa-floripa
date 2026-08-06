"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { TRIP } from "@/data/trip";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

const EMPTY_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: false,
};

function getTimeLeft(): TimeLeft {
  const distance = new Date(TRIP.targetDate).getTime() - Date.now();

  if (distance <= 0) return { ...EMPTY_TIME, finished: true };

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    finished: false,
  };
}

function CountdownTimer({ time }: { time: TimeLeft }) {
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
          className="glass rounded-2xl px-2 py-4 text-center sm:rounded-3xl sm:px-5 sm:py-6"
        >
          <strong className="block font-display text-3xl font-black tabular-nums text-white sm:text-6xl">
            {String(value).padStart(2, "0")}
          </strong>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-xs">
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DaysRemainingCard({ time }: { time: TimeLeft }) {
  const totalDays = time.finished
    ? 0
    : time.days + (time.hours + time.minutes + time.seconds > 0 ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.85 }}
      className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-xl"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          Próximo destino
        </p>
        <p className="mt-1 text-lg font-bold text-white">
          {time.finished ? "Floripa é agora!" : `Faltam ${totalDays} dias para Floripa`}
        </p>
      </div>
      <div className="grid size-11 place-items-center rounded-full bg-coral text-ink shadow-lg shadow-coral/20">
        <MapPin size={20} />
      </div>
    </motion.div>
  );
}

export function HeroCountdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTime(getTimeLeft());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="hero relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,23,.92)_0%,rgba(5,18,23,.6)_53%,rgba(5,18,23,.28)_100%)]" />
      <div className="noise absolute inset-0 opacity-30" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between">
          <a
            href="#inicio"
            className="flex items-center gap-2 text-sm font-black tracking-[0.18em] text-white"
          >
            <Plane className="text-coral" size={18} /> FLN / 2026
          </a>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            15 AGO 2026
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

        <a href="#passagem" className="flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50 transition hover:text-white">
          Começar a jornada <ArrowDown className="animate-bounce" size={16} />
        </a>
      </div>
    </section>
  );
}
