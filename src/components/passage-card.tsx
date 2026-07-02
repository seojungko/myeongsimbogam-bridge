import { RotateCcw, Volume2 } from "lucide-react";
import type { StudyPageRecord } from "@dataset/types";

type PassageCardProps = {
  passage: StudyPageRecord;
};

export function PassageCard({ passage }: PassageCardProps) {
  return (
    <article className="rounded-lg border border-surface-hairline bg-surface-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--accent))]">
            오늘의 문장
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {passage.title}
          </h2>
        </div>
        <button
          type="button"
          className="bg-white/8 grid size-10 place-items-center rounded-md text-white"
          aria-label="본문 듣기"
        >
          <Volume2 className="size-5" aria-hidden />
        </button>
      </div>

      <div className="bg-black/42 mt-6 rounded-md p-4">
        <p className="text-2xl font-semibold leading-10 text-white">
          {passage.fullHanja}
        </p>
        <p className="text-white/74 mt-3 text-base leading-7">
          {passage.fullKorean}
        </p>
      </div>

      <p className="text-white/82 mt-4 text-base leading-7">
        {passage.translation}
      </p>

      <div className="border-white/8 mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-white/54 text-sm">{passage.source}</span>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[rgb(var(--accent))] px-4 text-sm font-semibold text-black"
        >
          <RotateCcw className="size-4" aria-hidden />
          암기 시작
        </button>
      </div>
    </article>
  );
}
