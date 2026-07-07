const CACHE_PREFIXES = ["bridge-"];

async function clearBridgeCaches() {
  if (!("caches" in self)) {
    return;
  }

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((cacheName) =>
        CACHE_PREFIXES.some((prefix) => cacheName.startsWith(prefix))
      )
      .map((cacheName) => caches.delete(cacheName))
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(clearBridgeCaches());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clearBridgeCaches().then(async () => {
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })
  );
});

self.addEventListener("fetch", () => {
  // Intentionally do not intercept requests during active development.
});
