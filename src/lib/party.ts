"use client";

import confetti from "canvas-confetti";
import { playCelebrationFanfare } from "@/lib/celebration";

export async function launchPartyBurst() {
  void playCelebrationFanfare();

  const end = Date.now() + 4500;
  const colors = ["#FF7657", "#D9FF70", "#ffffff", "#087F79", "#FFD166"];

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      spread: 100,
      origin: { x: 0.5, y: 0.2 },
      colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  // Explosão central extra
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 55,
    origin: { y: 0.55 },
    colors,
    zIndex: 9999,
  });
}
