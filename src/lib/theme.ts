export const accents = [
  { name: "ocean", label: "Ocean", hex: "#38bdf8" },
  { name: "forest", label: "Forest", hex: "#34d399" },
  { name: "ember", label: "Ember", hex: "#fb7185" },
  { name: "violet", label: "Violet", hex: "#a78bfa" }
] as const;

export type AccentName = (typeof accents)[number]["name"];
