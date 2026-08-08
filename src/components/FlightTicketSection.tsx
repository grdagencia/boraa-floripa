"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { TRIP } from "@/data/trip";

export function FlightTicketSection() {
  return (
    <section id="passagem" className="section-pad relative overflow-hidden bg-sand text-ink">
      <div className="absolute -right-28 top-20 size-96 rounded-full bg-coral/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className="eyebrow">A data está marcada</p>
          <h2 className="section-title mt-4">
            Isso não é plano.
            <span className="block text-coral">É passagem.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/60">
            Em {TRIP.displayDate}, às {TRIP.displayTime}, a rota muda e a ilha volta a fazer parte da nossa história.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="info-pill">
              <CalendarDays size={16} /> 15 AGO · {TRIP.displayTime}
            </span>
            <span className="info-pill">
              <PlaneTakeoff size={16} /> Destino FLN
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ y: -8, rotate: -0.5 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.35 }}
          className="group relative"
        >
          <div className="absolute inset-4 rounded-[2rem] bg-ink/20 blur-2xl transition group-hover:blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-ink/15 sm:p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-ink/5">
              <Image
                src={TRIP.ticketImage}
                alt="Cartão de viagem para Florianópolis"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-2 transition duration-700 group-hover:scale-[1.02] sm:p-3"
                priority
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">
                  Boarding pass
                </p>
                <p className="mt-1 font-display text-xl font-black">
                  Rumo a Florianópolis
                </p>
              </div>
              <ShieldCheck className="text-teal" aria-label="Dados protegidos" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
