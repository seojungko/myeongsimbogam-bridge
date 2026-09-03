"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type {
  LearningChunk,
  LearningMeaningLink,
  StudyPageRecord
} from "@dataset/types";

type LearningModePilotProps = {
  passage: StudyPageRecord;
};

type LearningPhase =
  | {
      kind: "chunk";
      chunkIndex: number;
      setIndex: number;
      step: number;
    }
  | {
      kind: "review";
      setIndex: number;
    };

const meaningLinkClasses = [
  "bg-sky-300/10 ring-1 ring-inset ring-sky-200/12",
  "bg-emerald-300/10 ring-1 ring-inset ring-emerald-200/12"
];

function getCharacterDetails(passage: StudyPageRecord, hanja: string) {
  return Array.from(hanja).map((character) => {
    const details = passage.characters.find(
      (candidate) => candidate.character === character
    );

    return {
      character,
      meaning: details?.meaning ?? "",
      sound: details?.sound ?? ""
    };
  });
}

function getLinkIndex(
  links: readonly LearningMeaningLink[] | undefined,
  character: string
) {
  return links?.findIndex((link) => link.character === character) ?? -1;
}

function renderLinkedMeaning(chunk: LearningChunk) {
  const links = chunk.meaningLinks ?? [];
  const matches = links
    .map((link, linkIndex) => ({
      end: chunk.directMeaning.indexOf(link.target) + link.target.length,
      linkIndex,
      start: chunk.directMeaning.indexOf(link.target),
      target: link.target
    }))
    .filter((match) => match.start >= 0)
    .sort((left, right) => left.start - right.start);
  const parts: ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      parts.push(chunk.directMeaning.slice(cursor, match.start));
    }

    parts.push(
      <span
        className={cn("rounded px-0.5", meaningLinkClasses[match.linkIndex])}
        key={`${match.target}-${match.start}`}
      >
        {match.target}
      </span>
    );
    cursor = match.end;
  });

  if (cursor < chunk.directMeaning.length) {
    parts.push(chunk.directMeaning.slice(cursor));
  }

  return parts;
}

function LearningBoard({
  chunk,
  passage,
  step
}: {
  chunk: LearningChunk;
  passage: StudyPageRecord;
  step: number;
}) {
  const details = useMemo(
    () => getCharacterDetails(passage, chunk.hanja),
    [chunk.hanja, passage]
  );
  const isReadingTogether = step >= details.length;
  const firstGridColumn = Math.max(1, 6 - details.length);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="text-white/78 flex h-8 items-center text-sm font-black">
        {isReadingTogether
          ? "같이 읽어볼까?"
          : `무슨 ${details[step]?.sound ?? ""}?`}
      </p>

      <div className="learning-board relative grid h-[8.5rem] w-full max-w-[22rem] grid-cols-10">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-7 rounded-md bg-[rgb(var(--accent)/0.1)] transition-opacity",
            isReadingTogether ? "opacity-100" : "opacity-0"
          )}
          aria-hidden
        />

        {details.map((detail, index) => {
          const isCurrent = !isReadingTogether && index === step;
          const isLearned = isReadingTogether || index <= step;
          const linkIndex = isReadingTogether
            ? getLinkIndex(chunk.meaningLinks, detail.character)
            : -1;

          return (
            <div
              className={cn(
                "relative z-10 col-span-2 flex h-[8.5rem] min-w-0 flex-col items-center",
                linkIndex >= 0 &&
                  cn("rounded-md", meaningLinkClasses[linkIndex])
              )}
              key={`${detail.character}-${index}`}
              style={{ gridColumnStart: firstGridColumn + index * 2 }}
            >
              <div className="flex h-14 w-full items-center justify-center overflow-visible">
                <span
                  className={cn(
                    "learning-hanja text-[clamp(2.375rem,11.8vw,2.6875rem)] font-black leading-none tracking-normal transition-[color,opacity,transform] duration-150",
                    isCurrent
                      ? "scale-[1.06] text-[rgb(var(--accent))]"
                      : "text-white"
                  )}
                >
                  {detail.character}
                </span>
              </div>
              <div className="flex h-[3.25rem] w-full items-center justify-center overflow-hidden px-0.5">
                <span
                  className={cn(
                    "learning-meaning max-h-10 break-keep text-center text-[0.72rem] font-bold leading-4 transition-[color,opacity] duration-150",
                    isLearned
                      ? isCurrent
                        ? "text-[rgb(var(--accent))]"
                        : "text-white/62"
                      : "opacity-0"
                  )}
                  aria-hidden={!isLearned}
                >
                  {detail.meaning}
                </span>
              </div>
              <div className="flex h-7 w-full items-center justify-center">
                <span
                  className={cn(
                    "learning-sound whitespace-nowrap text-sm font-black transition-[color,opacity] duration-150",
                    isLearned
                      ? isReadingTogether || isCurrent
                        ? "text-[rgb(var(--accent))]"
                        : "text-white/58"
                      : "opacity-0"
                  )}
                  aria-hidden={!isLearned}
                >
                  {detail.sound}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex h-[4.5rem] w-full max-w-[22rem] items-start justify-center px-2 pt-3">
        <p
          className={cn(
            "learning-direct-meaning break-keep text-center text-base font-bold leading-7 transition-opacity duration-150",
            isReadingTogether ? "text-white/82 opacity-100" : "opacity-0"
          )}
          aria-hidden={!isReadingTogether}
        >
          {renderLinkedMeaning(chunk)}
        </p>
      </div>
    </div>
  );
}

function SetReview({
  chunks,
  isFinalSet
}: {
  chunks: readonly LearningChunk[];
  isFinalSet: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <p className="text-white/78 flex h-8 items-center text-sm font-black">
        {isFinalSet ? "이 부분을 함께 읽어볼까?" : "두 구절을 함께 읽어볼까?"}
      </p>
      <div className="learning-set-review grid h-[13rem] w-full max-w-[22rem] grid-cols-2 items-center gap-2">
        {chunks.map((chunk) => (
          <div
            className="flex min-w-0 flex-col items-center rounded-lg bg-white/[0.035] px-1.5 py-3"
            key={chunk.hanja}
          >
            <p className="whitespace-nowrap text-[clamp(1.25rem,6.5vw,1.7rem)] font-black leading-none text-white">
              {chunk.hanja}
            </p>
            <p className="mt-2 whitespace-nowrap text-[clamp(0.72rem,3.2vw,0.9rem)] font-bold text-[rgb(var(--accent))]">
              {chunk.reading}
            </p>
            <p className="text-white/68 mt-3 min-h-14 break-keep text-center text-[0.78rem] font-semibold leading-5">
              {chunk.directMeaning}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LearningModePilot({ passage }: LearningModePilotProps) {
  const learningSets = passage.learningSets;
  const [phase, setPhase] = useState<LearningPhase>({
    kind: "chunk",
    chunkIndex: 0,
    setIndex: 0,
    step: 0
  });

  if (!learningSets || learningSets.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-5 text-center">
        <p className="text-white/58 break-keep text-base font-bold leading-7">
          이 구절의 배우기는 준비하고 있어요.
        </p>
      </div>
    );
  }

  const currentSet = learningSets[phase.setIndex];
  const currentChunk =
    phase.kind === "chunk" ? currentSet.chunks[phase.chunkIndex] : null;
  const chunksBeforeSet = learningSets
    .slice(0, phase.setIndex)
    .reduce((total, learningSet) => total + learningSet.chunks.length, 0);
  const completedChunks =
    chunksBeforeSet +
    (phase.kind === "review" ? currentSet.chunks.length : phase.chunkIndex);
  const activeChunkIndex =
    phase.kind === "review" ? -1 : chunksBeforeSet + phase.chunkIndex;
  const allChunks = learningSets.flatMap((learningSet) => learningSet.chunks);
  const learningSetCount = learningSets.length;
  const isFinalReview =
    phase.kind === "review" && phase.setIndex === learningSetCount - 1;

  function advance() {
    if (phase.kind === "review") {
      if (phase.setIndex < learningSetCount - 1) {
        setPhase({
          kind: "chunk",
          chunkIndex: 0,
          setIndex: phase.setIndex + 1,
          step: 0
        });
      } else {
        setPhase({ kind: "chunk", chunkIndex: 0, setIndex: 0, step: 0 });
      }
      return;
    }

    const characterCount = Array.from(currentChunk?.hanja ?? "").length;

    if (phase.step < characterCount) {
      setPhase({ ...phase, step: phase.step + 1 });
      return;
    }

    if (phase.chunkIndex < currentSet.chunks.length - 1) {
      setPhase({ ...phase, chunkIndex: phase.chunkIndex + 1, step: 0 });
      return;
    }

    setPhase({ kind: "review", setIndex: phase.setIndex });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="mx-auto flex h-5 w-full max-w-[15rem] shrink-0 items-center justify-center gap-1.5"
        aria-label={`이 쪽 배우기 ${completedChunks}/${allChunks.length}구절`}
      >
        {learningSets.map((learningSet, setIndex) => (
          <div className="flex flex-1 gap-1" key={setIndex}>
            {learningSet.chunks.map((chunk, chunkIndex) => {
              const flatIndex =
                learningSets
                  .slice(0, setIndex)
                  .reduce((total, item) => total + item.chunks.length, 0) +
                chunkIndex;

              return (
                <span
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-150",
                    flatIndex < completedChunks
                      ? "bg-[rgb(var(--accent)/0.72)]"
                      : flatIndex === activeChunkIndex
                        ? "bg-[rgb(var(--accent)/0.34)]"
                        : "bg-white/10"
                  )}
                  key={chunk.hanja}
                  aria-hidden
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto overflow-x-hidden py-1">
        {phase.kind === "chunk" && currentChunk ? (
          <LearningBoard
            chunk={currentChunk}
            passage={passage}
            step={phase.step}
          />
        ) : (
          <SetReview chunks={currentSet.chunks} isFinalSet={isFinalReview} />
        )}
      </div>

      <button
        type="button"
        className="study-action-button w-full shrink-0 bg-[rgb(var(--accent))] font-black text-black active:scale-[0.99] active:brightness-105"
        onClick={advance}
        onPointerDown={(event) => event.preventDefault()}
      >
        {isFinalReview ? "처음부터 다시 보기" : "다음"}
      </button>
    </div>
  );
}
