"use client";

import { useEffect } from "react";

export function PwaRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let isMounted = true;

    async function removeStalePwaCaches() {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations.map((registration) => registration.unregister())
        );

        if ("caches" in window) {
          const cacheNames = await window.caches.keys();
          await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        }

        if (isMounted && navigator.serviceWorker.controller) {
          window.location.reload();
        }
      } catch {
        // Restricted browsers may block service worker or cache APIs.
      }
    }

    void removeStalePwaCaches();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
