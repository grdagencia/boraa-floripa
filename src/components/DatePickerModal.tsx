"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  datetimeLocalToTripIso,
  tripIsoToDatetimeLocal,
} from "@/lib/tripDate";

type DatePickerModalProps = {
  open: boolean;
  currentIso: string;
  onClose: () => void;
  onSave: (iso: string) => void;
};

export function DatePickerModal({
  open,
  currentIso,
  onClose,
  onSave,
}: DatePickerModalProps) {
  const [value, setValue] = useState(() => tripIsoToDatetimeLocal(currentIso));

  useEffect(() => {
    if (open) setValue(tripIsoToDatetimeLocal(currentIso));
  }, [open, currentIso]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="pick-date-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0c2228] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-coral">
              Nova data
            </p>
            <h3
              id="pick-date-title"
              className="mt-2 font-display text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl"
            >
              Escolhe a pohaa da data
            </h3>
            <p className="mt-2 text-sm text-white/55">
              O timer reinicia, o título volta e a festa reseta. Bora marcar o próximo sumiço.
            </p>

            <label className="mt-6 block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
              Data e hora do voo
              <input
                type="datetime-local"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base font-semibold text-white outline-none focus:border-coral/60"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white/70 transition hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!value}
                onClick={() => {
                  if (!value) return;
                  onSave(datetimeLocalToTripIso(value));
                }}
                className="rounded-full bg-coral px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-ink transition hover:brightness-110 disabled:opacity-40"
              >
                Salvar e reiniciar
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
