"use client";

import { useEffect, useRef } from "react";

/**
 * Sem F5: consulta a versão do deploy e recarrega sozinho quando muda.
 *
 * Importante: só funciona em abas que JÁ carregaram uma versão com este watcher.
 * Se a aba foi aberta antes dessa feature existir, precisa de 1 F5 manual;
 * daí em diante as próximas atualizações vêm sozinhas.
 */
export function SoftUpdateWatcher() {
  const baseline = useRef<string | null>(null);
  const tourLocked = useRef(false);
  const reloading = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const shouldSkipReload = () => {
      if (typeof window === "undefined") return true;
      if (window.location.hostname === "localhost") return true;
      if (window.location.hostname === "127.0.0.1") return true;
      if (new URLSearchParams(window.location.search).has("tour")) return true;
      if (tourLocked.current) return true;
      if (document.hidden) return true;
      return false;
    };

    const onTourLock = (event: Event) => {
      const detail = (event as CustomEvent).detail as { locked?: boolean };
      tourLocked.current = Boolean(detail?.locked);
    };
    window.addEventListener("floripa:tour-lock", onTourLock);

    const check = async () => {
      if (cancelled || reloading.current || shouldSkipReload()) return;

      try {
        const res = await fetch(`/api/version?t=${Date.now()}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!res.ok || cancelled) return;

        const data = (await res.json()) as { version?: string };
        const version = (data.version ?? "").trim();
        if (!version) return;

        if (baseline.current === null) {
          baseline.current = version;
          return;
        }

        if (baseline.current !== version) {
          reloading.current = true;
          window.location.reload();
        }
      } catch {
        // Rede instável: tenta de novo no próximo ciclo.
      }
    };

    // Checa cedo e com frequência para pegar deploy novo rápido.
    const bootTimer = window.setTimeout(() => {
      void check();
    }, 5_000);
    const id = window.setInterval(() => {
      void check();
    }, 15_000);

    const onVisible = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(bootTimer);
      window.clearInterval(id);
      window.removeEventListener("floripa:tour-lock", onTourLock);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  return null;
}
