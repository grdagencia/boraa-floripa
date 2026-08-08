"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, Palmtree } from "lucide-react";

export function FinalMotivationSection() {
  return (
    <section id="final" className="relative flex min-h-[85svh] items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=90"
        alt="Praia de águas azuis ao pôr do sol"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(5,18,23,.93),rgba(5,18,23,.55),rgba(5,18,23,.2))]" />
      <div className="noise absolute inset-0 opacity-25" />

      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.75 }}
        className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12"
      >
        <Palmtree className="mb-8 text-lime" size={42} />
        <p className="max-w-4xl font-display text-[clamp(2.8rem,7vw,6.8rem)] font-black leading-[0.95] tracking-[-0.045em] text-white">
          O relógio está correndo. Floripa está esperando.
          <span className="mt-3 block text-coral">Agora é fazer acontecer.</span>
        </p>
        <a
          href="#inicio"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:-translate-y-1 hover:bg-lime"
        >
          Voltar ao início <ArrowUp size={17} />
        </a>
      </motion.div>

      <div className="absolute bottom-5 left-0 right-0 mx-auto flex max-w-7xl items-center justify-between px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:px-8 lg:px-12">
        <span>Let&apos;s go pohaaa</span>
        <span>Floripa · 2026</span>
      </div>
    </section>
  );
}
