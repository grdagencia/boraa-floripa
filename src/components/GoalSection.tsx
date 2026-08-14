"use client";

import { Center, ContactShadows, Environment, Float, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { MathUtils } from "three";
import { GOAL } from "@/data/trip";
import { getTimeLeft, TOUR_EVENTS, type TimeLeft } from "@/lib/countdown";

const MODEL_PATH = "/models/iphone.glb";
const REST_Y = Math.PI + 0.35;
const REST_X = -0.18;

type SpinState = {
  start: number;
  fromY: number;
  fromX: number;
  duration: number;
};

function IPhoneModel({ active }: { active: boolean }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const settledRef = useRef(false);
  const spinRef = useRef<SpinState | null>(null);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((obj) => {
      const mesh = obj as { isMesh?: boolean; castShadow?: boolean; receiveShadow?: boolean };
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clone]);

  useEffect(() => {
    if (active && !spinRef.current) settledRef.current = false;
  }, [active]);

  useEffect(() => {
    const onTour = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string }>).detail;
      if (detail?.action !== "spin") return;
      const g = groupRef.current;
      settledRef.current = true;
      spinRef.current = {
        start: performance.now(),
        fromY: g?.rotation.y ?? REST_Y,
        fromX: g?.rotation.x ?? REST_X,
        duration: 4200,
      };
    };
    window.addEventListener(TOUR_EVENTS.iphone, onTour);
    return () => window.removeEventListener(TOUR_EVENTS.iphone, onTour);
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const spin = spinRef.current;
    if (spin) {
      const t = Math.min(1, (performance.now() - spin.start) / spin.duration);
      const ease = 1 - Math.pow(1 - t, 3);
      g.rotation.y = spin.fromY + Math.PI * 2.15 * ease;
      g.rotation.x = spin.fromX + Math.sin(t * Math.PI) * 0.32;
      if (t >= 1) {
        g.rotation.y = REST_Y;
        g.rotation.x = REST_X;
        spinRef.current = null;
        settledRef.current = true;
        window.dispatchEvent(new Event(TOUR_EVENTS.iphoneSpinDone));
      }
      return;
    }

    if (!settledRef.current && active) {
      const ease = 1 - Math.pow(0.0006, delta);
      g.rotation.y = MathUtils.lerp(g.rotation.y, REST_Y, ease);
      g.rotation.x = MathUtils.lerp(g.rotation.x, REST_X, ease);
      if (Math.abs(g.rotation.y - REST_Y) < 0.02 && Math.abs(g.rotation.x - REST_X) < 0.02) {
        g.rotation.y = REST_Y;
        g.rotation.x = REST_X;
        settledRef.current = true;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[-0.1, Math.PI * 0.15, 0]}>
      <Center>
        <primitive object={clone} scale={12} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

function IPhoneScene({ active }: { active: boolean }) {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4.5, 6, 3]} intensity={1.35} castShadow />
      <directionalLight position={[-4, 2.5, -2]} intensity={0.55} color="#9fdcff" />
      <spotLight position={[0, 8, 2]} angle={0.35} penumbra={0.7} intensity={0.9} />
      <Environment preset="studio" environmentIntensity={0.55} />

      <PresentationControls
        global
        cursor={false}
        snap={false}
        speed={1.35}
        zoom={1}
        polar={[-Math.PI / 2.2, Math.PI / 2.2]}
        azimuth={[-Math.PI * 1.2, Math.PI * 1.2]}
      >
        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.4}>
          <IPhoneModel active={active} />
        </Float>
      </PresentationControls>

      <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={10} blur={2.8} far={4} />
    </>
  );
}

function IPhoneCanvas({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-full min-h-[360px] w-full animate-pulse rounded-3xl bg-white/5" />;
  }

  return (
    <Canvas
      className="h-full min-h-[360px] w-full touch-none"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, 4.2], fov: 32, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <IPhoneScene active={active} />
      </Suspense>
    </Canvas>
  );
}

function MiniGoalTimer({ time }: { time: TimeLeft }) {
  if (time.finished) return null;

  const parts = [
    ["d", time.days],
    ["h", time.hours],
    ["m", time.minutes],
    ["s", time.seconds],
  ] as const;

  return (
    <div
      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5"
      aria-label="Contagem até a meta do iPhone"
    >
      {parts.map(([label, value], index) => (
        <span key={label} className="flex items-baseline gap-0.5">
          {index > 0 ? <span className="mx-0.5 text-white/20">·</span> : null}
          <strong className="font-display text-sm font-black tabular-nums text-red-400">
            {String(value).padStart(2, "0")}
          </strong>
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

type PurchaseStatus = "yes" | "no" | null;

function PurchaseUnlockBox({
  status,
  onChange,
}: {
  status: PurchaseStatus;
  onChange: (next: PurchaseStatus) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 max-w-sm rounded-2xl border border-coral/35 bg-coral/10 p-4"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-coral">
        Meta desbloqueada · 26/08
      </p>
      <p className="mt-2 text-sm font-bold text-white">Comprou o iPhone 15 Pro Max?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
            status === "yes"
              ? "bg-lime text-ink"
              : "border border-white/15 bg-white/5 text-white hover:border-lime/40"
          }`}
        >
          <Check size={14} /> Sim, comprei
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
            status === "no"
              ? "bg-red-500 text-white"
              : "border border-white/15 bg-white/5 text-white hover:border-red-400/40"
          }`}
        >
          <X size={14} /> Ainda não
        </button>
      </div>
      <AnimatePresence mode="wait">
        {status === "yes" ? (
          <motion.p
            key="yes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs leading-relaxed text-lime/90"
          >
            Máquina na mão. Operação Volta pra Ilha com sinal cheio.
          </motion.p>
        ) : status === "no" ? (
          <motion.p
            key="no"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs leading-relaxed text-white/55"
          >
            Meta ainda aberta. Mantém o foco — o alvo continua travado.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Fallback Sketchfab (comentado — ativar se o GLB pesar demais no mobile):
 *
 * <iframe
 *   title="iPhone 15 Pro Max"
 *   src="https://sketchfab.com/models/b6a3fb1799024cfe80537dbc92dabfdf/embed?autostart=1&ui_theme=dark&ui_watermark=0&ui_infos=0&transparent=1&ui_controls=0&ui_stop=0"
 *   className="h-full min-h-[360px] w-full rounded-3xl border-0"
 *   allow="autoplay; fullscreen; xr-spatial-tracking"
 *   allowFullScreen
 * />
 */

export function GoalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35, once: false });
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [purchase, setPurchase] = useState<PurchaseStatus>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(GOAL.storageKey);
      if (stored === "yes" || stored === "no") setPurchase(stored);
    } catch {
      // ignore
    }

    const tick = () => setTime(getTimeLeft(GOAL.targetDate));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const savePurchase = (next: PurchaseStatus) => {
    setPurchase(next);
    try {
      if (next) window.localStorage.setItem(GOAL.storageKey, next);
      else window.localStorage.removeItem(GOAL.storageKey);
    } catch {
      // ignore
    }
  };

  const unlocked = Boolean(time?.finished);

  return (
    <section
      id="meta"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/5 bg-[#05080a]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,118,87,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(217,255,112,0.06),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6 lg:px-12 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="order-1"
        >
          <p className="text-xs font-black uppercase tracking-[0.32em] text-coral">
            Meta travada
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.4rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
            Próximo Alvo
            <span className="block text-outline">Travado.</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
            Boraaa pegar o nosso celular!!!
          </p>

          <div className="mt-8 space-y-1">
            <p className="font-display text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">
              {GOAL.name}
            </p>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-400 sm:text-base">
              {GOAL.displayDate}
            </p>

            {time && !unlocked ? <MiniGoalTimer time={time} /> : null}
            {unlocked ? (
              <PurchaseUnlockBox status={purchase} onChange={savePurchase} />
            ) : null}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="order-2 h-[min(68svh,560px)] w-full lg:h-[min(72svh,640px)]"
        >
          <IPhoneCanvas active={inView} />
          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Arraste para girar
          </p>
        </motion.div>
      </div>
    </section>
  );
}
