export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

export const EMPTY_TIME: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: false,
};

export function getTimeLeft(targetDate: string, now = Date.now()): TimeLeft {
  const distance = new Date(targetDate).getTime() - now;

  if (distance <= 0) return { ...EMPTY_TIME, finished: true };

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    finished: false,
  };
}

export function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => resolve(), ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export function smoothScrollTo(
  id: string,
  block: ScrollLogicalPosition = "start",
) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block });
}

export function waitForWindowEvent(name: string, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const cleanup = () => {
      window.removeEventListener(name, onDone);
      signal?.removeEventListener("abort", onAbort);
    };

    const onDone = () => {
      cleanup();
      resolve();
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    window.addEventListener(name, onDone, { once: true });
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export const TOUR_EVENTS = {
  airbnb: "floripa:tour-airbnb",
  airbnbSpinDone: "floripa:airbnb-spin-done",
  missions: "floripa:tour-missions",
  ticket: "floripa:tour-ticket",
  ticketDone: "floripa:ticket-done",
} as const;
