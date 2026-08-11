"use client";

import { useMemo } from "react";
import {
  getMotivationalDay,
  MOTIVATIONAL_COPY,
  type MotivationalDay,
} from "@/data/motivationalCopy";
import type { TimeLeft } from "@/lib/countdown";

export type HeroTitleMode = "default" | "motivational";

export type MotivationalHeroState = {
  mode: HeroTitleMode;
  day: MotivationalDay | null;
  message: string | null;
};

export function useMotivationalHeroDay(time: TimeLeft | null): MotivationalHeroState {
  return useMemo(() => {
    if (!time) {
      return { mode: "default", day: null, message: null };
    }

    const day = getMotivationalDay(time.days, time.finished);

    if (day === null) {
      return { mode: "default", day: null, message: null };
    }

    return {
      mode: "motivational",
      day,
      message: MOTIVATIONAL_COPY[day],
    };
  }, [time]);
}
