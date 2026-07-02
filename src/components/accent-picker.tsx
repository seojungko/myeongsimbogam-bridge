"use client";

import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import type { AccentName } from "@/lib/theme";
import { accents } from "@/lib/theme";

const STORAGE_KEY = "bridge:accent";

export function AccentPicker() {
  const [accent, setAccent] = useState<AccentName>("ocean");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as AccentName | null;
    if (saved && accents.some((item) => item.name === saved)) {
      setAccent(saved);
      document.documentElement.dataset.accent = saved;
    }
  }, []);

  function updateAccent(nextAccent: AccentName) {
    setAccent(nextAccent);
    document.documentElement.dataset.accent = nextAccent;
    window.localStorage.setItem(STORAGE_KEY, nextAccent);
  }

  return (
    <div className="rounded-lg border border-surface-hairline bg-surface-card p-2">
      <div className="text-white/58 mb-2 flex items-center gap-2 px-1 text-xs font-medium">
        <Palette className="size-3.5" aria-hidden />
        Accent
      </div>
      <div className="flex gap-1">
        {accents.map((item) => (
          <button
            key={item.name}
            type="button"
            className="grid size-8 place-items-center rounded-md border border-white/10"
            aria-label={`${item.label} theme`}
            aria-pressed={accent === item.name}
            onClick={() => updateAccent(item.name)}
          >
            <span
              className="size-4 rounded-full"
              style={{ backgroundColor: item.hex }}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}
