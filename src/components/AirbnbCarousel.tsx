"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, MapPin, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AIRBNB_OPTIONS, type AirbnbOption } from "@/data/trip";
import { TOUR_EVENTS, wait } from "@/lib/countdown";

function AirbnbCard({
  option,
  active,
  pulsing,
}: {
  option: AirbnbOption;
  active: boolean;
  pulsing: boolean;
}) {
  return (
    <motion.a
      href={option.url}
      target="_blank"
      rel="noopener noreferrer"
      animate={{
        scale: pulsing ? [1, 1.04, 1] : active ? 1 : 0.94,
        opacity: active || pulsing ? 1 : 0.65,
      }}
      transition={
        pulsing
          ? { duration: 0.7, repeat: 4, ease: "easeInOut" }
          : { duration: 0.45 }
      }
      className={`group block overflow-hidden rounded-[2rem] border p-3 shadow-2xl shadow-black/20 backdrop-blur-xl ${
        option.preferred
          ? "border-lime/50 bg-lime/[0.08] ring-1 ring-lime/30"
          : "border-white/10 bg-white/[0.07]"
      } ${pulsing ? "ring-2 ring-lime shadow-[0_0_40px_rgba(217,255,112,0.35)]" : ""}`}
      aria-label={`Ver ${option.name} — ${option.neighborhood} no Airbnb`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem]">
        <Image
          src={option.image}
          alt={`${option.name} — ${option.neighborhood}`}
          fill
          sizes="(max-width: 768px) 90vw, 56vw"
          className="object-cover transition duration-700 group-hover:scale-105"
          priority={option.preferred}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          {option.preferred ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-ink shadow-lg shadow-lime/30">
              <Star size={12} fill="currentColor" /> Preferido
            </span>
          ) : null}
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-ink">
            Opção {String(option.id).padStart(2, "0")}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-5 sm:p-7">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-lime">
              <MapPin size={14} /> {option.neighborhood}
            </p>
            <h3 className="mt-2 font-display text-2xl font-black text-white sm:text-4xl">
              {option.name}
            </h3>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-coral text-ink transition group-hover:-translate-y-1 group-hover:translate-x-1">
            <ExternalLink size={18} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-4 sm:px-5">
        <span className="text-sm text-white/55">
          {option.preferred ? "Nossa primeira escolha" : "Hospedagem completa"}
        </span>
        <strong className="font-display text-xl text-white">{option.price}</strong>
      </div>
    </motion.a>
  );
}

export function AirbnbCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tourLocked, setTourLocked] = useState(false);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const spinningRef = useRef(false);
  const emblaApiRef = useRef(emblaApi);

  useEffect(() => {
    emblaApiRef.current = emblaApi;
  }, [emblaApi]);

  const syncSelected = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const pauseAutoplay = useCallback(() => setPaused(true), []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", syncSelected);
    emblaApi.on("reInit", syncSelected);
    emblaApi.on("pointerDown", pauseAutoplay);
    return () => {
      emblaApi.off("select", syncSelected);
      emblaApi.off("reInit", syncSelected);
      emblaApi.off("pointerDown", pauseAutoplay);
    };
  }, [emblaApi, pauseAutoplay, syncSelected]);

  useEffect(() => {
    if (!emblaApi || paused || tourLocked) return;
    const autoplay = window.setInterval(() => emblaApi.scrollNext(), 5200);
    return () => window.clearInterval(autoplay);
  }, [emblaApi, paused, tourLocked]);

  useEffect(() => {
      const spinToPreferred = async (fastMs = 5000) => {
      const api = emblaApiRef.current;
      if (!api || spinningRef.current) return;
      spinningRef.current = true;
      setTourLocked(true);
      setPaused(true);
      setPulseIndex(null);

      try {
        const preferredIndex = Math.max(
          0,
          AIRBNB_OPTIONS.findIndex((option) => option.preferred),
        );

        // Gira rápido a partir do card atual — sem voltar pro início.
        const fastUntil = Date.now() + fastMs;
        while (Date.now() < fastUntil) {
          api.scrollNext();
          await wait(85);
        }

        // Desacelera até pousar no preferido.
        let delay = 140;
        let safety = AIRBNB_OPTIONS.length * 3;
        while (api.selectedScrollSnap() !== preferredIndex && safety > 0) {
          api.scrollNext();
          await wait(delay);
          delay = Math.min(delay + 90, 650);
          safety -= 1;
        }

        if (api.selectedScrollSnap() !== preferredIndex) {
          api.scrollTo(preferredIndex);
          await wait(400);
        }

        setPulseIndex(preferredIndex);
      } finally {
        spinningRef.current = false;
        window.dispatchEvent(new Event(TOUR_EVENTS.airbnbSpinDone));
      }
    };

    const onTour = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        action?: string;
        index?: number;
        fastMs?: number;
      };
      if (!detail?.action) return;

      if (detail.action === "pause") {
        setTourLocked(true);
        setPaused(true);
      }
      if (detail.action === "resume") {
        setTourLocked(false);
        setPaused(false);
        setPulseIndex(null);
      }
      if (detail.action === "goto" && typeof detail.index === "number") {
        emblaApiRef.current?.scrollTo(detail.index);
      }
      if (detail.action === "pulse" && typeof detail.index === "number") {
        emblaApiRef.current?.scrollTo(detail.index);
        setPulseIndex(detail.index);
      }
      if (detail.action === "spinToPreferred") {
        void spinToPreferred(detail.fastMs ?? 5000);
      }
    };

    window.addEventListener(TOUR_EVENTS.airbnb, onTour);
    return () => window.removeEventListener(TOUR_EVENTS.airbnb, onTour);
  }, []);

  return (
    <section id="airbnbs" className="section-pad overflow-hidden bg-ink text-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-10 flex max-w-7xl items-end justify-between px-5 sm:px-8 lg:px-12"
      >
        <div>
          <p className="eyebrow text-lime">Próxima decisão</p>
          <h2 className="section-title mt-4">Onde vamos ficar?</h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-white/45 md:block">
          {AIRBNB_OPTIONS.length} opções reais. Jurerê lidera como preferido — o resto é plano B de respeito.
        </p>
      </motion.div>

      <div
        id="airbnb-stage"
        className="cursor-grab overflow-hidden active:cursor-grabbing"
        ref={emblaRef}
        onMouseEnter={() => {
          if (!tourLocked) setPaused(true);
        }}
        onMouseLeave={() => {
          if (!tourLocked) setPaused(false);
        }}
      >
        <div className="flex touch-pan-y">
          {AIRBNB_OPTIONS.map((option, index) => (
            <div
              key={option.id}
              className="min-w-0 flex-[0_0_90%] px-2 sm:flex-[0_0_72%] lg:flex-[0_0_58%] lg:px-4"
            >
              <AirbnbCard
                option={option}
                active={selected === index}
                pulsing={pulseIndex === index}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-9 flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex max-w-[60%] flex-wrap gap-2">
          {AIRBNB_OPTIONS.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                selected === index
                  ? option.preferred
                    ? "w-9 bg-lime"
                    : "w-9 bg-coral"
                  : option.preferred
                    ? "w-2 bg-lime/50 hover:bg-lime/70"
                    : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir para opção ${index + 1}${option.preferred ? " preferida" : ""}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            className="carousel-button"
            aria-label="Opção anterior"
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            className="carousel-button"
            aria-label="Próxima opção"
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </section>
  );
}
