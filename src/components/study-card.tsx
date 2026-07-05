"use client";

import { Sparkle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { StudyPageRecord } from "@dataset/types";

type StudyCardProps = {
  passages: readonly StudyPageRecord[];
};

type StudyViewMode = "study" | "translation" | "characters";

function maskVisibleCharacters(value: string) {
  return Array.from(value)
    .map((character) => (/\s/.test(character) ? character : "□"))
    .join("");
}

function maskAfterPrompt(fullText: string, prompt: string) {
  if (prompt.length === 0) {
    return maskVisibleCharacters(fullText);
  }

  const promptIndex = fullText.indexOf(prompt);

  if (promptIndex === -1) {
    return maskVisibleCharacters(fullText);
  }

  const beforePrompt = fullText.slice(0, promptIndex);
  const afterPrompt = fullText.slice(promptIndex + prompt.length);

  return `${maskVisibleCharacters(beforePrompt)}${prompt}${maskVisibleCharacters(afterPrompt)}`;
}

function getCompactDotIndexes(currentIndex: number, totalPages: number) {
  const maxDots = 7;

  if (totalPages <= maxDots) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const halfWindow = Math.floor(maxDots / 2);
  const maxStart = totalPages - maxDots;
  const start = Math.min(Math.max(currentIndex - halfWindow, 0), maxStart);

  return Array.from({ length: maxDots }, (_, index) => start + index);
}

export function StudyCard({ passages }: StudyCardProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [viewMode, setViewMode] = useState<StudyViewMode>("study");
  const [sparkleKey, setSparkleKey] = useState(0);
  const [isTurningPage, setIsTurningPage] = useState(false);

  const totalPages = passages.length;

  if (totalPages === 0) {
    return (
      <article className="study-card relative flex min-h-[calc(100svh-32px)] w-full items-center justify-center overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#121212] p-5 text-center text-white shadow-soft">
        <p className="text-xl font-bold">학습 데이터가 없습니다.</p>
      </article>
    );
  }

  const currentIndex = Math.min(pageIndex, totalPages - 1);
  const passage = passages[currentIndex];
  const progressDotIndexes = getCompactDotIndexes(currentIndex, totalPages);
  const fullTranslation = passage.translation;
  const promptTranslation = passage.promptTranslation;
  const maskedHanja = maskAfterPrompt(passage.fullHanja, passage.promptHanja);
  const maskedKorean = maskAfterPrompt(
    passage.fullKorean,
    passage.promptKorean
  );
  const maskedTranslation = maskAfterPrompt(fullTranslation, promptTranslation);

  function toggleReveal() {
    if (viewMode === "characters") {
      setViewMode("study");
      setIsRevealed(true);
      return;
    }

    setIsRevealed((current) => !current);
  }

  function toggleTranslationMode() {
    setViewMode((current) =>
      current === "translation" ? "study" : "translation"
    );
    setIsRevealed(false);
  }

  function toggleCharactersMode() {
    setViewMode((current) =>
      current === "characters" ? "study" : "characters"
    );
    setIsRevealed(false);
  }

  function next() {
    setIsTurningPage(true);
    setSparkleKey((current) => current + 1);
    setPageIndex((current) => (current + 1) % totalPages);
    setIsRevealed(false);
    setViewMode("study");
    window.setTimeout(() => setIsTurningPage(false), 260);
  }

  return (
    <article
      className="study-card relative flex max-h-[calc(100svh-32px)] min-h-[calc(100svh-32px)] w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#121212] p-4 text-white shadow-soft"
      data-state={isRevealed ? "open" : "closed"}
      data-turning={isTurningPage ? "true" : "false"}
    >
      <div
        className="book-cover pointer-events-none absolute inset-0 rounded-lg"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <header className="shrink-0">
          <p className="text-center text-base font-bold text-white">
            {passage.page}페이지
          </p>
          <p className="text-white/58 mt-1 text-center text-sm font-semibold">
            {currentIndex + 1} / {totalPages}
          </p>
          <div
            className="mt-3 flex items-center justify-center gap-2"
            aria-label={`${totalPages}개 중 ${currentIndex + 1}번째 학습 카드`}
          >
            {progressDotIndexes.map((index) => {
              const isCurrent = index === currentIndex;

              return (
                <span
                  key={index}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isCurrent
                      ? "h-2.5 w-8 bg-[rgb(var(--accent))]"
                      : "bg-white/22 size-2.5"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                />
              );
            })}
          </div>
        </header>

        <section className="study-page-content flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-1 py-4 text-center">
          {viewMode === "study" ? (
            <div className="flex w-full flex-col gap-6">
              <div className="w-full">
                <p className="text-white/52 text-xs font-semibold">한자</p>
                <p className="mt-2 w-full max-w-full whitespace-pre-wrap break-keep text-[clamp(1.9rem,7vw,2.6rem)] font-black leading-[1.35] tracking-normal text-white">
                  {isRevealed ? passage.fullHanja : maskedHanja}
                </p>
              </div>

              <div className="w-full">
                <p className="text-white/52 text-xs font-semibold">소리</p>
                <p className="mt-2 w-full max-w-full whitespace-pre-wrap break-keep text-[clamp(1.15rem,4.8vw,1.65rem)] font-bold leading-[1.55] tracking-normal text-white">
                  {isRevealed ? passage.fullKorean : maskedKorean}
                </p>
              </div>

              <p className="text-white/48 text-sm font-semibold">
                소리내어 말해보세요.
              </p>
            </div>
          ) : null}

          {viewMode === "translation" ? (
            <p className="text-white/84 w-full max-w-full whitespace-pre-wrap break-keep px-1 text-[clamp(1.05rem,4.5vw,1.35rem)] font-semibold leading-[1.65]">
              {isRevealed ? fullTranslation : maskedTranslation}
            </p>
          ) : null}

          {viewMode === "characters" ? (
            <div className="text-white/84 flex w-full max-w-full flex-wrap justify-center gap-x-3 gap-y-2 px-1 text-[clamp(0.95rem,4vw,1.1rem)] font-semibold leading-7">
              {passage.characters.map((character) => (
                <span key={`${passage.id}-${character.character}`}>
                  {character.character} {character.meaning} {character.sound}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <div className="flex shrink-0 flex-col gap-3">
          <button
            type="button"
            className={cn(
              "study-action-button",
              isRevealed &&
                "border-[rgb(var(--accent))] bg-[rgb(var(--accent))] text-black"
            )}
            onClick={toggleReveal}
          >
            <span aria-hidden>{isRevealed ? "🙈" : "👁"}</span>
            {isRevealed ? "다시 외워보기" : "펼쳐보기"}
          </button>
          <button
            type="button"
            className={cn(
              "study-action-button",
              viewMode === "translation" && "border-white/24 bg-white/14"
            )}
            onClick={toggleTranslationMode}
          >
            {viewMode === "translation" ? "한자 보기" : "뜻 보기"}
          </button>
          <button
            type="button"
            className={cn(
              "study-action-button",
              viewMode === "characters" && "border-white/24 bg-white/14"
            )}
            onClick={toggleCharactersMode}
          >
            한자 뜻 보기
          </button>
          <div className="relative">
            {sparkleKey > 0 ? (
              <div
                key={sparkleKey}
                className="study-sparkles pointer-events-none absolute -top-5 right-4 text-[rgb(var(--accent))]"
                aria-hidden
              >
                <Sparkle className="study-sparkle study-sparkle-one size-3.5" />
                <Sparkle className="study-sparkle study-sparkle-two size-3" />
                <Sparkle className="study-sparkle study-sparkle-three size-2.5" />
              </div>
            ) : null}
            <button
              type="button"
              className="study-action-button w-full bg-[rgb(var(--accent))] font-black text-black"
              onClick={next}
            >
              다음!
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
