"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  PartyPopper,
  Target,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { INITIAL_MISSIONS, UI } from "@/data/trip";

const STORAGE_KEY = "floripa-missions-v2";
const CHANGE_EVENT = "floripa-missions-change";
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
  const [currentPage, setCurrentPage] = useState(0);

  const missions = INITIAL_MISSIONS;
  const missionsPerPage = UI.missionsPerPage;
  const totalPages = Math.max(1, Math.ceil(missions.length / missionsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);

  const visibleMissions = useMemo(() => {
    const startIndex = safePage * missionsPerPage;
    return missions.slice(startIndex, startIndex + missionsPerPage);
  }, [missions, missionsPerPage, safePage]);

  const showPagination = missions.length > missionsPerPage;

  const toggleMission = (id: string) => {
    const next = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Continua utilizável mesmo com armazenamento bloqueado.
    }
  };

  return (
    <section id="missoes" className="section-pad relative overflow-hidden bg-[#f4ede0] text-ink">
      <div className="absolute -left-32 bottom-0 size-[28rem] rounded-full bg-lime/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="eyebrow">Reta final</p>
          <h2 className="section-title mt-4">
            Missão: resolver antes de <span className="text-teal">Floripa.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/60">
            Cada check tira um peso das costas e coloca a gente mais perto do mar.
          </p>
          <div className="mt-8 grid size-16 place-items-center rounded-2xl bg-ink text-lime shadow-xl shadow-ink/15">
            <Target size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-ink/10 backdrop-blur-xl sm:p-8"
        >
          <ProgressBar completed={completed.length} total={missions.length} />

          <div className="mt-7 min-h-[22rem] space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {visibleMissions.map((mission) => {
                  const done = completed.includes(mission.id);
                  return (
                    <motion.button
                      key={mission.id}
                      type="button"
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleMission(mission.id)}
                      className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition sm:px-5 ${
                        done
                          ? "border-teal/15 bg-teal/[0.07]"
                          : "border-ink/[0.08] bg-white/60 hover:border-coral/35 hover:bg-white"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition ${
                          done
                            ? "border-teal bg-teal text-white"
                            : "border-ink/20 group-hover:border-coral"
                        }`}
                      >
                        <AnimatePresence>
                          {done ? (
                            <motion.span
                              initial={{ scale: 0, rotate: -35 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                            >
                              <Check size={16} strokeWidth={4} />
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                      <span
                        className={`relative font-bold transition-colors ${
                          done ? "text-ink/40" : "text-ink/80"
                        }`}
                      >
                        {mission.label}
                        <motion.span
                          className="absolute left-0 top-1/2 h-px bg-ink/35"
                          animate={{ width: done ? "100%" : "0%" }}
                        />
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {showPagination ? (
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                disabled={safePage === 0}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink transition enabled:hover:border-coral/40 enabled:hover:bg-white disabled:opacity-35"
                aria-label="Página anterior"
              >
                <ArrowLeft size={14} /> Anterior
              </button>

              <div className="flex items-center gap-2" aria-label={`Página ${safePage + 1} de ${totalPages}`}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      safePage === index ? "w-7 bg-coral" : "w-2 bg-ink/20 hover:bg-ink/35"
                    }`}
                    aria-label={`Ir para página ${index + 1}`}
                    aria-current={safePage === index ? "page" : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages - 1, page + 1))
                }
                disabled={safePage >= totalPages - 1}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink transition enabled:hover:border-coral/40 enabled:hover:bg-white disabled:opacity-35"
                aria-label="Próxima página"
              >
                Próximo <ArrowRight size={14} />
              </button>
            </div>
          ) : null}

          <AnimatePresence>
            {completed.length === missions.length && missions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-5 flex items-center gap-3 rounded-2xl bg-lime/35 px-5 py-4 font-bold text-ink"
              >
                <PartyPopper className="text-teal" /> Tudo pronto. Agora é só partir!
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
