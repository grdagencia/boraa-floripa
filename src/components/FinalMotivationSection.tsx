"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { UI } from "@/data/trip";

export function FinalMotivationSection() {
  return (
    <section id="final" className="relative flex min-h-[85svh] items-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={UI.finalGif}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,.92),rgba(0,0,0,.58),rgba(0,0,0,.28))]" />
      <div className="noise absolute inset-0 opacity-25" />

      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75 }}
        className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
      >
        <p className="max-w-5xl font-display text-[clamp(2.4rem,6.5vw,6.2rem)] font-black uppercase leading-[0.95] tracking-[-0.045em] text-white">
          Operação meter o pé daqui e encher o bolso de dinheiro.
        </p>
        <p className="mt-6 font-display text-[clamp(1.6rem,4vw,3.2rem)] font-black uppercase tracking-[-0.04em] text-coral">
          Saiiii da casa do Norb...
        </p>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white/55 sm:text-base">
          Aqui você continua mácio.
        </p>
        <a
          href="#inicio"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:-translate-y-1 hover:bg-lime"
        >
          Voltar ao início <ArrowUp size={17} />
        </a>
      </motion.div>

      <div className="absolute bottom-5 left-0 right-0 mx-auto flex max-w-7xl items-center justify-between px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:px-8 lg:px-12">
        <span>Modo caverna</span>
        <span>BH · 2026</span>
      </div>
    </section>
  );
}
