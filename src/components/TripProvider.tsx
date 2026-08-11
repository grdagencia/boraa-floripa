"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TRIP } from "@/data/trip";
import { getTimeLeft, type TimeLeft } from "@/lib/countdown";
import { playAlertBuzzer } from "@/lib/celebration";
import {
  clearStoredTargetDate,
  formatDisplayDate,
  formatDisplayTime,
  readStoredTargetDate,
  writeStoredTargetDate,
} from "@/lib/tripDate";

export type FinishedPhase =
  | "idle" // ainda contando
  | "choice" // zerou: Eai Fomos embora?
  | "cuiudo" // festa + título + Chile
  | "macio"; // texto macio + escolher data

type TripContextValue = {
  targetDate: string;
  displayDate: string;
  displayTime: string;
  time: TimeLeft | null;
  finishedPhase: FinishedPhase;
  setFinishedPhase: (phase: FinishedPhase) => void;
  saveNewTargetDate: (iso: string) => void;
  resetToDefaultTrip: () => void;
  isParty: boolean;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [targetDate, setTargetDate] = useState(TRIP.targetDate);
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [finishedPhase, setFinishedPhase] = useState<FinishedPhase>("idle");
  const [hydrated, setHydrated] = useState(false);
  const alertPlayedRef = useRef(false);

  useEffect(() => {
    const stored = readStoredTargetDate(TRIP.targetDate);
    setTargetDate(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const tick = () => {
      const next = getTimeLeft(targetDate);
      setTime(next);

      if (next.finished) {
        setFinishedPhase((prev) => {
          if (prev === "idle") {
            if (!alertPlayedRef.current) {
              alertPlayedRef.current = true;
              void playAlertBuzzer();
            }
            return "choice";
          }
          return prev;
        });
      } else {
        alertPlayedRef.current = false;
        setFinishedPhase((prev) =>
          prev === "cuiudo" || prev === "macio" ? prev : "idle",
        );
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetDate, hydrated]);

  const saveNewTargetDate = useCallback((iso: string) => {
    writeStoredTargetDate(iso);
    setTargetDate(iso);
    setFinishedPhase("idle");
    alertPlayedRef.current = false;
  }, []);

  const resetToDefaultTrip = useCallback(() => {
    clearStoredTargetDate();
    setTargetDate(TRIP.targetDate);
    setFinishedPhase("idle");
    alertPlayedRef.current = false;
  }, []);

  const value = useMemo<TripContextValue>(
    () => ({
      targetDate,
      displayDate: formatDisplayDate(targetDate) || TRIP.displayDate,
      displayTime: formatDisplayTime(targetDate) || TRIP.displayTime,
      time,
      finishedPhase,
      setFinishedPhase,
      saveNewTargetDate,
      resetToDefaultTrip,
      isParty: finishedPhase === "cuiudo",
    }),
    [
      targetDate,
      time,
      finishedPhase,
      saveNewTargetDate,
      resetToDefaultTrip,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
