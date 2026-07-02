import type { LucideIcon } from "lucide-react";

type ProgressPanelProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function ProgressPanel({
  icon: Icon,
  label,
  value
}: ProgressPanelProps) {
  return (
    <article className="rounded-lg border border-surface-hairline bg-surface-card p-3">
      <Icon className="size-4 text-[rgb(var(--accent))]" aria-hidden />
      <p className="text-white/52 mt-3 text-xs">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </article>
  );
}
