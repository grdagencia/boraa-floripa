"use client";

import { motion } from "framer-motion";

const COUNCIL_COPY =
  "A real é uma só: o mercado não tem pena de quem é mole. Ninguém vai bater na nossa porta pra entregar a vida que a gente quer. Cada apresentação ajustada, cada anúncio rodando, cada edição terminada de madrugada... tudo isso é tijolo do nosso império. Nós, já provamos a garra que têmos. Agora é blindar a mente. Deixa os 'mácio' pra trás, ignora o ruído de fora e foca 100% no que bota grana no bolso e acelera a nossa ida pra praia. A liberdade custa muito caro, mas a gente tem o motor e a disposição pra pagar o preço. Continua executando a porra do plano. A Ilha é o destino final, BH é só o caixa.";

const WORDS = COUNCIL_COPY.split(" ");

const list = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.018, delayChildren: 0.12 },
  },
};

const word = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export function WarCouncilSection() {
  return (
    <section
      id="conselho"
      className="relative flex min-h-[90svh] items-center overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,118,87,0.08),transparent_58%)]" />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(1.8rem,5vw,3.4rem)] font-black uppercase tracking-[0.08em] text-white"
        >
          CONSELHO DA CAVERNA:
        </motion.h2>
        <motion.p
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mt-10 font-display text-[clamp(1.05rem,2.35vw,1.4rem)] font-medium leading-[1.8] tracking-[-0.015em] text-white/86"
        >
          {WORDS.map((item, index) => (
            <motion.span
              key={`${item}-${index}`}
              variants={word}
              whileHover={{
                scale: 1.14,
                color: "#ff1a1a",
                y: -2,
              }}
              whileTap={{ scale: 1.08, color: "#ff1a1a" }}
              className="inline-block cursor-pointer pr-[0.28em]"
            >
              {item}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
