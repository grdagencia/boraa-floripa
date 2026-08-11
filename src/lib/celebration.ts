"use client";

/** Fanfarra curta via Web Audio (sem arquivo externo). */
export async function playCelebrationFanfare() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    await ctx.resume();

    const now = ctx.currentTime;

    const blast = (freq: number, start: number, dur: number, gain = 0.18) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + start);
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(gain, now + start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    };

    // Cornetadas alegres em terças / quintas
    blast(392, 0, 0.35, 0.16); // G4
    blast(523.25, 0.08, 0.4, 0.14); // C5
    blast(659.25, 0.18, 0.45, 0.12); // E5
    blast(783.99, 0.45, 0.55, 0.18); // G5
    blast(1046.5, 0.55, 0.7, 0.14); // C6
    blast(523.25, 0.9, 0.35, 0.12);
    blast(659.25, 1.05, 0.4, 0.14);
    blast(783.99, 1.2, 0.85, 0.2);

    window.setTimeout(() => {
      void ctx.close();
    }, 2500);
  } catch {
    // Autoplay / AudioContext bloqueado — confetes ainda rodam.
  }
}

/** Trombone triste / wah-wah descendente (Macio). */
export async function playSadTrombone() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    await ctx.resume();

    const now = ctx.currentTime;

    const moan = (
      from: number,
      to: number,
      start: number,
      dur: number,
      gain = 0.42,
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1100, now + start);
      filter.frequency.exponentialRampToValueAtTime(320, now + start + dur);
      osc.frequency.setValueAtTime(from, now + start);
      osc.frequency.exponentialRampToValueAtTime(to, now + start + dur);
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(gain, now + start + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.08);
    };

    // Queda clássica de "fail" (tipo wah-wah triste) — volume reforçado
    moan(392, 349.23, 0, 0.45, 0.4);
    moan(349.23, 311.13, 0.42, 0.5, 0.38);
    moan(311.13, 261.63, 0.88, 0.65, 0.36);
    moan(261.63, 196, 1.45, 1.1, 0.45);

    window.setTimeout(() => {
      void ctx.close();
    }, 3200);
  } catch {
    // ignore
  }
}

/** Buzina / alerta tipo sirene curta (timer zerou). */
export async function playAlertBuzzer() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    await ctx.resume();

    const now = ctx.currentTime;

    const beep = (freq: number, start: number, dur: number, gain = 0.38) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + start);
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(gain, now + start + 0.015);
      g.gain.setValueAtTime(gain, now + start + dur * 0.75);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.04);
    };

    // Buzina alternando (tipo alerta de partida)
    const pattern = [
      [880, 0, 0.22],
      [660, 0.28, 0.22],
      [880, 0.56, 0.22],
      [660, 0.84, 0.22],
      [880, 1.12, 0.28],
      [740, 1.48, 0.35],
      [990, 1.9, 0.45],
    ] as const;

    for (const [freq, start, dur] of pattern) {
      beep(freq, start, dur, 0.4);
    }

    window.setTimeout(() => {
      void ctx.close();
    }, 2800);
  } catch {
    // ignore
  }
}
