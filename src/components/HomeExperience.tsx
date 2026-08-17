"use client";

import { useCallback, useState } from "react";
import { ChileDestinationSection } from "@/components/ChileDestinationSection";
import { FinalMotivationSection } from "@/components/FinalMotivationSection";
import { GoalSection } from "@/components/GoalSection";
import { HeroCountdown } from "@/components/HeroCountdown";
import { HourlyMotivationTour } from "@/components/HourlyMotivationTour";
import { IntroPlaneReveal } from "@/components/IntroPlaneReveal";
import { MandatoryVideosSection } from "@/components/MandatoryVideosSection";
import { PaginatedChecklist } from "@/components/PaginatedChecklist";
import { SalesNotification } from "@/components/SalesNotification";
import { SoftUpdateWatcher } from "@/components/SoftUpdateWatcher";
import { TripProvider, useTrip } from "@/components/TripProvider";
import { WarCouncilSection } from "@/components/WarCouncilSection";
import { XingamentoSection } from "@/components/XingamentoSection";

function HomeBody() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);
  const { finishedPhase, time } = useTrip();
  const finished = Boolean(time?.finished);
  const showRest = finishedPhase === "idle" && !finished;

  return (
    <>
      <SoftUpdateWatcher />
      <IntroPlaneReveal onComplete={handleIntroComplete} />
      <SalesNotification enabled={introDone && showRest} />
      <HourlyMotivationTour enabled={introDone && showRest} />
      <main>
        <HeroCountdown />
        {finishedPhase === "cuiudo" ? <ChileDestinationSection active /> : null}
        {showRest || finishedPhase === "choice" || finishedPhase === "macio" ? (
          <>
            <MandatoryVideosSection />
            <XingamentoSection />
            <PaginatedChecklist />
            <GoalSection />
            <WarCouncilSection />
            <FinalMotivationSection />
          </>
        ) : null}
      </main>
    </>
  );
}

export function HomeExperience() {
  return (
    <TripProvider>
      <HomeBody />
    </TripProvider>
  );
}
