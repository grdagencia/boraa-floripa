/** Persistência da data-alvo do countdown (override do TRIP.targetDate). */

export const TARGET_DATE_STORAGE_KEY = "floripa-target-date-v3";

export function readStoredTargetDate(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(TARGET_DATE_STORAGE_KEY);
    if (!stored) return fallback;
    const ms = new Date(stored).getTime();
    if (!Number.isFinite(ms)) return fallback;
    return stored;
  } catch {
    return fallback;
  }
}

export function writeStoredTargetDate(iso: string) {
  window.localStorage.setItem(TARGET_DATE_STORAGE_KEY, iso);
}

export function clearStoredTargetDate() {
  try {
    window.localStorage.removeItem(TARGET_DATE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Converte valor de <input type="datetime-local"> (local) para ISO com offset -03:00. */
export function datetimeLocalToTripIso(localValue: string): string {
  // localValue: "2026-09-20T05:55"
  const [datePart, timePart = "00:00"] = localValue.split("T");
  const time = timePart.length === 5 ? `${timePart}:00` : timePart;
  return `${datePart}T${time}-03:00`;
}

export function tripIsoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  // Formata no fuso do browser; ok para o picker.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

export function formatDisplayTime(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(d);
}
