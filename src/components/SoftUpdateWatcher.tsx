"use client";

import { useEffect, useRef } from "react";

/**
 * Sem F5: consulta a versão do deploy e recarrega sozinho quando muda.
 * Assim o sócio vê a atualização sem você avisar.
 */
export function SoftUpdateWatcher() {
  const baseline = useRef<string | null>(null);
  const pendingVersion = useRef<string | null>(null);
  const tourLocked = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Em localhost / durante tour / com ?tour=1, não força reload.
    const shouldSkipReload = () => {
      if (typeof window === "undefined") return true;
      if (window.location.hostname === "localhost") return true;
      if (window.location.hostname === "127.0.0.1") return true;
      if (new URLSearchParams(window.location.search).has("tour")) return true;
      if (tourLocked.current) return true;
      return false;
    };

    const onTourLock = (event: Event) => {
      const detail = (event as CustomEvent).detail as { locked?: boolean };
      tourLocked.current = Boolean(detail?.locked);
    };
    window.addEventListener("floripa:tour-lock", onTourLock);

    const check = async () => {
      if (shouldSkipReload()) return;

      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { version?: string };
        const version = data.version ?? "";
        if (!version) return;

        if (baseline.current === null) {
          baseline.current = version;
          return;
        }

        if (baseline.current === version) {
          pendingVersion.current = null;
          return;
        }

        // Confirma a mudança em duas leituras seguidas para evitar falso positivo.
        if (pendingVersion.current !== version) {
          pendingVersion.current = version;
          return;
        }

        window.location.reload();
      } catch {
        // Rede instável: tenta de novo no próximo ciclo.
      }
    };

    // Primeira checagem só depois de alguns segundos (evita reload na abertura).
    const bootTimer = window.setTimeout(() => {
      void check();
    }, 20_000);
    const id = window.setInterval(check, 45_000);

    return () => {
      cancelled = true;
      window.clearTimeout(bootTimer);
      window.clearInterval(id);
      window.removeEventListener("floripa:tour-lock", onTourLock);
    };
  }, []);

  return null;
}
