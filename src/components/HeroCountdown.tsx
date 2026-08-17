"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, MapPin, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { DatePickerModal } from "@/components/DatePickerModal";
import { DefaultHeroSubtitle } from "@/components/MotivationalHeroTitle";
import { useTrip } from "@/components/TripProvider";
import { UI } from "@/data/trip";
import type { TimeLeft } from "@/lib/countdown";
import { launchPartyBurst } from "@/lib/party";
import { playSadTrombone } from "@/lib/celebration";

function CountdownTimer({ time }: { time: TimeLeft }) {
  const urgent = !time.finished && time.days <= UI.urgentDaysThreshold;
  const units = [
    ["Dias", time.days],
    ["Horas", time.hours],
    ["Min", time.minutes],
    ["Seg", time.seconds],
  ] as const;

  return (
    <div
      className={`grid grid-cols-4 gap-2 sm:gap-4 ${time.finished ? "timer-pulse" : ""}`}
      aria-label="Contagem regressiva"
    >
      {units.map(([label, value], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.08 }}
          className="glass rounded-2xl px-2 py-4 text-center sm:rounded-3xl sm:px-5 sm:py-6"
        >
          <strong
            className={`block font-display text-3xl font-black tabular-nums sm:text-6xl ${
              urgent || time.finished ? "text-red-400" : "text-white"
            }`}
          >
            {String(value).padStart(2, "0")}
          </strong>
          <span
            className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs ${
              urgent || time.finished ? "text-red-300/80" : "text-white/55"
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
  const urgent = !time.finished && time.days <= UI.urgentDaysThreshold;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.85 }}
      className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-xl"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          Operação modo caverna
        </p>
        <p
          className={`mt-1 text-lg font-bold ${
            urgent || time.finished ? "text-red-300" : "text-white"
          }`}
        >
          {time.finished ? "BH é agora. Executa." : "Foco total. BH dia 19!"}
        </p>
      </div>
      <div className="grid size-11 place-items-center rounded-full bg-coral text-ink shadow-lg shadow-coral/20">
        <MapPin size={20} />
      </div>
    </motion.div>
  );
}

function ChoiceButtons({
  onCuiudo,
  onMacio,
}: {
  onCuiudo: () => void;
  onMacio: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={onCuiudo}
        className="rounded-full bg-lime px-6 py-4 text-left text-sm font-black uppercase tracking-[0.06em] text-ink shadow-[0_0_40px_rgba(217,255,112,0.35)] transition hover:scale-[1.02] hover:brightness-105"
      >
        Óbvio né — Aqui é CUIUDO
      </button>
      <button
        type="button"
        onClick={onMacio}
        className="rounded-full border border-white/20 bg-white/10 px-6 py-4 text-left text-sm font-black uppercase tracking-[0.06em] text-white backdrop-blur-md transition hover:border-coral/50 hover:bg-coral/15"
      >
        Não — Fui Macio
      </button>
    </div>
  );
}

export function HeroCountdown() {
  const {
    time,
    displayTime,
    displayDate,
    finishedPhase,
    setFinishedPhase,
    targetDate,
    saveNewTargetDate,
    isParty,
  } = useTrip();

  const [dateOpen, setDateOpen] = useState(false);
  const [showPickDateBtn, setShowPickDateBtn] = useState(false);

  // Botão "Escolher outra data" 5s após Macio.
  useEffect(() => {
    if (finishedPhase !== "macio") {
      setShowPickDateBtn(false);
      return;
    }
    setShowPickDateBtn(false);
    const id = window.setTimeout(() => setShowPickDateBtn(true), 5_000);
    return () => window.clearTimeout(id);
  }, [finishedPhase]);

  const finished = Boolean(time?.finished);
  const navLabel = `${displayDate.split(" de ")[0] ?? ""} · ${displayTime}`.toUpperCase();

  const handleCuiudo = async () => {
    setFinishedPhase("cuiudo");
    await launchPartyBurst();
  };

  const handleMacio = () => {
    setFinishedPhase("macio");
    void playSadTrombone();
  };

  return (
    <section
      id="inicio"
      className={`hero relative overflow-hidden ${isParty ? "party-mode" : ""}`}
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={UI.heroImage}
          alt=""
          className="h-full w-full object-cover object-[center_20%] brightness-105 contrast-125 saturate-[1.05]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.74)_0%,rgba(0,0,0,.45)_52%,rgba(0,0,0,.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.26)_0%,transparent_42%,rgba(0,0,0,.42)_100%)]" />
        <div className="noise absolute inset-0 opacity-10" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col justify-between px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between">
          <a
            href="#inicio"
            className="flex items-center gap-2 text-sm font-black tracking-[0.18em] text-white"
          >
            <Plane className="text-coral" size={18} /> BH / 2026
          </a>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
            {navLabel}
          </span>
        </nav>

        <div className="grid items-end gap-10 py-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-coral"
            >
              <span className="h-px w-9 bg-coral" /> Operação modo caverna: destino BH
            </motion.p>

            <AnimatePresence mode="wait">
              {finishedPhase === "choice" && finished ? (
                <motion.div
                  key="choice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 1.2 }}
                >
                  <h1 className="font-display text-[clamp(2.8rem,9vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-white">
                    Eai
                    <span className="block text-outline">Fomos embora?</span>
                  </h1>
                  <ChoiceButtons
                    onCuiudo={() => {
                      void handleCuiudo();
                    }}
                    onMacio={handleMacio}
                  />
                </motion.div>
              ) : finishedPhase === "cuiudo" ? (
                <motion.div
                  key="cuiudo"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4 }}
                >
                  <h1 className="font-display text-[clamp(1.7rem,5.5vw,4.2rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.55)]">
                    Aeeee caralhoooo
                    <span className="mt-2 block text-lime">boraaa Floripa/SC/Jurerê</span>
                    <span className="mt-2 block text-coral">que me aguarde pohaaa!!!</span>
                  </h1>
                </motion.div>
              ) : finishedPhase === "macio" ? (
                <motion.div
                  key="macio"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3 }}
                >
                  <h1 className="font-display text-[clamp(1.55rem,4.8vw,3.4rem)] font-black uppercase leading-[1.05] tracking-[-0.035em] text-white">
                    Nós samos macio????
                    <span className="mt-3 block text-coral">
                      Então trabalha e mete o pé da casa do seu pai cara.
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                    E o chile? e Jurerê?, e Floripa?, e Santa catarina?, e a Pipoca? HAMMM ?
                    Vamuuu embora aqui nãoé nosso lugar. Se nào é hoje é quando? Já escolhe a
                    pohaa da data para o próximo dia que vai sumir daqui.
                  </p>

                  <AnimatePresence>
                    {showPickDateBtn ? (
                      <motion.button
                        key="pick-date"
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        onClick={() => setDateOpen(true)}
                        className="mt-8 rounded-full bg-coral px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-ink shadow-[0_0_35px_rgba(255,118,87,0.35)] transition hover:brightness-110"
                      >
                        Escolher outra data
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="normal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h1 className="font-display text-[clamp(2.8rem,8vw,6.8rem)] font-black uppercase leading-[0.86] tracking-[-0.055em] text-white">
                    A hora de ser
                    <span className="block text-outline">cuiudo.</span>
                  </h1>
                  <DefaultHeroSubtitle show />
                </motion.div>
              )}
            </AnimatePresence>
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
          href={finishedPhase === "cuiudo" ? "#chile" : "#videos-obrigatorios"}
          className="flex w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
        >
          {finishedPhase === "cuiudo" ? "Ver o Chile" : "Ir para as missões"}{" "}
          <ArrowDown className="animate-bounce" size={16} />
        </a>
      </div>

      <DatePickerModal
        open={dateOpen}
        currentIso={targetDate}
        onClose={() => setDateOpen(false)}
        onSave={(iso) => {
          saveNewTargetDate(iso);
          setDateOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </section>
  );
}
