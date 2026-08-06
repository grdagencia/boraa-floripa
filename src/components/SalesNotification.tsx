"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UI } from "@/data/trip";

type SalesNotificationProps = {
  enabled?: boolean;
};

export function SalesNotification({ enabled = true }: SalesNotificationProps) {
  const [visible, setVisible] = useState(false);
  const cancelledRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    cancelledRef.current = false;
    timersRef.current = [];

    if (!enabled) return;

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
      return id;
    };

    const show = () => {
      if (cancelledRef.current) return;
      setVisible(true);
      schedule(() => {
        if (cancelledRef.current) return;
        setVisible(false);
      }, UI.notificationVisibleMs);
    };

    schedule(show, UI.notificationFirstDelayMs);

    return () => {
      cancelledRef.current = true;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [enabled]);

  const handleExitComplete = () => {
    if (cancelledRef.current || !enabled) return;
    const id = window.setTimeout(() => {
      if (cancelledRef.current) return;
      setVisible(true);
      const hideId = window.setTimeout(() => {
        if (!cancelledRef.current) setVisible(false);
      }, UI.notificationVisibleMs);
      timersRef.current.push(hideId);
    }, UI.notificationGapMs);
    timersRef.current.push(id);
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {visible ? (
        <motion.img
          key="sale-toast"
          src={UI.notificationImage}
          alt="Notificação de venda"
          width={600}
          height={157}
          initial={{ y: -88, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -64, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed right-3 top-3 z-[90] h-auto w-[min(92vw,360px)] bg-transparent object-contain sm:right-5 sm:top-5"
        />
      ) : null}
    </AnimatePresence>
  );
}
