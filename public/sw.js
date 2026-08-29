const CACHE_NAME = "family-hub-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Important:
  // Do not intercept page navigations.
  // Next.js middleware/auth redirects must work normally.
  if (request.mode === "navigate") {
    return;
  }

  // Let Next.js handle its generated assets normally.
  if (url.pathname.startsWith("/_next/")) {
    return;
  }

  // Ignore external resources.
  if (url.origin !== self.location.origin) {
    return;
  }

  // For now, just let the browser fetch normally.
  // We can introduce safe static caching later.
  return;
});