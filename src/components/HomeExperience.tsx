"use client";

import { useCallback, useState } from "react";
import { AirbnbCarousel } from "@/components/AirbnbCarousel";
import { FinalMotivationSection } from "@/components/FinalMotivationSection";
import { FlightTicketSection } from "@/components/FlightTicketSection";
import { HeroCountdown } from "@/components/HeroCountdown";
import { IntroPlaneReveal } from "@/components/IntroPlaneReveal";
import { PaginatedChecklist } from "@/components/PaginatedChecklist";
import { SalesNotification } from "@/components/SalesNotification";

export function HomeExperience() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  return (
    <>
      <IntroPlaneReveal onComplete={handleIntroComplete} />
      <SalesNotification enabled={introDone} />
      <main>
        <HeroCountdown />
        <FlightTicketSection />
        <AirbnbCarousel />
        <PaginatedChecklist />
        <FinalMotivationSection />
      </main>
    </>
  );
}
