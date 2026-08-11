/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Soft-update: nunca cachear a versão do deploy.
    {
      matcher: ({ url }) => url.pathname === "/api/version",
      handler: new NetworkOnly(),
    },
    // Vídeos grandes: sempre rede (não enchem o cache do celular).
    {
      matcher: ({ request, url }) =>
        request.destination === "video" ||
        url.pathname.startsWith("/videos/") ||
        url.pathname.endsWith(".mp4"),
      handler: new NetworkOnly(),
    },
    // Ícones/manifest: cache estável.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icons/") || url.pathname === "/manifest.webmanifest",
      handler: new CacheFirst({
        cacheName: "pwa-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
