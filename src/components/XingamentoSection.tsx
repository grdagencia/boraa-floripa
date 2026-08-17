"use client";

import { motion } from "framer-motion";

export function XingamentoSection() {
  return (
    <section
      id="xingamento"
      className="relative flex min-h-[70svh] items-center overflow-hidden bg-black"
    >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,16,16,0.32),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-6xl px-5 py-24 text-center sm:px-8"
      >
        <p className="font-display text-[clamp(2rem,7vw,5.6rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.55)]">
          Pronto cuiudo motivado agora vai trabalhar{" "}
          <span className="text-[#ff1a1a] [text-shadow:0_0_28px_rgba(255,26,26,0.55)]">
            desgraçado
          </span>
          , porque{" "}
          <span className="text-[#ff1a1a] [text-shadow:0_0_28px_rgba(255,26,26,0.55)]">
            liso
          </span>{" "}
          nem a{" "}
          <span className="text-[#ff1a1a] [text-shadow:0_0_28px_rgba(255,26,26,0.55)]">
            mãe quer
          </span>
          .
        </p>
      </motion.div>
    </section>
  );
}
