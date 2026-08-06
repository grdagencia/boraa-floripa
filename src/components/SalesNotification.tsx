"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { UI } from "@/data/trip";

const SEEN_KEY = "floripa-notification-seen";

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

    // Só na primeira visita ao site.
    try {
      if (window.localStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      // Se o storage estiver bloqueado, ainda mostra uma vez nesta sessão.
    }

    const showId = window.setTimeout(() => {
      if (cancelledRef.current) return;
      setVisible(true);
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Ignora falha de storage.
      }

      const hideId = window.setTimeout(() => {
        if (!cancelledRef.current) setVisible(false);
      }, UI.notificationVisibleMs);
      timersRef.current.push(hideId);
    }, UI.notificationFirstDelayMs);

    timersRef.current.push(showId);

    return () => {
      cancelledRef.current = true;
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [enabled]);

  return (
    <AnimatePresence mode="wait">
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
