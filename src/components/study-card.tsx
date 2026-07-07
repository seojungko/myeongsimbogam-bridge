"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { StudyPageRecord } from "@dataset/types";

type StudyCardProps = {
  passages: readonly StudyPageRecord[];
};

type StudyViewMode = "phrase" | "meaning";
type CardDensity = "short" | "medium" | "long" | "extraLong";
type PhraseCell =
  | {
      hanja: string;
      key: string;
      reading: string;
      type: "character";
      visible: boolean;
    }
  | {
      key: string;
      type: "space";
    };

const LEARNED_RECORD_IDS_KEY = "bridge.learnedRecordIds";

const densityClasses: Record<
  CardDensity,
  {
    cell: string;
    cellGap: string;
    cellFrame: string;
    content: string;
    hanja: string;
    placeholder: string;
    reading: string;
    translation: string;
  }
> = {
  short: {
    cell: "w-[2.16rem]",
    cellGap: "gap-x-1.5 gap-y-3",
    cellFrame: "h-[4.1rem]",
    content: "overflow-hidden px-1 py-4",
    hanja: "text-[clamp(1.5rem,6.2vw,2.05rem)] leading-none",
    placeholder: "h-full",
    reading: "text-[clamp(0.78rem,3vw,0.98rem)] leading-tight",
    translation: "text-[clamp(1.15rem,4.6vw,1.5rem)] leading-[1.65]"
  },
  medium: {
    cell: "w-[1.92rem]",
    cellGap: "gap-x-1.5 gap-y-2.5",
    cellFrame: "h-[3.7rem]",
    content: "overflow-hidden px-1 py-3",
    hanja: "text-[clamp(1.35rem,5.4vw,1.82rem)] leading-none",
    placeholder: "h-full",
    reading: "text-[clamp(0.72rem,2.8vw,0.9rem)] leading-tight",
    translation: "text-[clamp(1.05rem,4vw,1.35rem)] leading-[1.6]"
  },
  long: {
    cell: "w-[1.65rem]",
    cellGap: "gap-x-1 gap-y-2",
    cellFrame: "h-[3.25rem]",
    content: "overflow-hidden px-1 py-2",
    hanja: "text-[clamp(1.18rem,4.7vw,1.55rem)] leading-none",
    placeholder: "h-full",
    reading: "text-[clamp(0.68rem,2.55vw,0.8rem)] leading-tight",
    translation: "text-[clamp(0.95rem,3.6vw,1.2rem)] leading-[1.55]"
  },
  extraLong: {
    cell: "w-[1.44rem]",
    cellGap: "gap-x-1 gap-y-1.5",
    cellFrame: "h-[2.9rem]",
    content: "overflow-y-auto overflow-x-hidden px-1 py-2",
    hanja: "text-[clamp(1.02rem,4vw,1.35rem)] leading-none",
    placeholder: "h-full",
    reading: "text-[clamp(0.62rem,2.3vw,0.74rem)] leading-tight",
    translation: "text-[clamp(0.88rem,3.2vw,1.05rem)] leading-[1.5]"
  }
};

function countVisibleCharacters(value: string) {
  return Array.from(value).filter((character) => !/\s/.test(character)).length;
}

function getCardDensity(passage: StudyPageRecord): CardDensity {
  const totalCharacters =
    countVisibleCharacters(passage.fullHanja) +
    countVisibleCharacters(passage.fullKorean) +
    countVisibleCharacters(passage.translation);

  if (totalCharacters >= 300) {
    return "extraLong";
  }

  if (totalCharacters >= 190) {
    return "long";
  }

  if (totalCharacters >= 110) {
    return "medium";
  }

  return "short";
}

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

function getVisibleOffsets(fullText: string, prompt: string) {
  const promptIndex = prompt.length > 0 ? fullText.indexOf(prompt) : -1;

  if (promptIndex === -1) {
    return new Set<number>();
  }

  const visibleOffsets = new Set<number>();
  let offset = 0;

  for (const character of Array.from(fullText)) {
    if (
      offset >= promptIndex &&
      offset < promptIndex + prompt.length &&
      !/\s/.test(character)
    ) {
      visibleOffsets.add(offset);
    }

    offset += character.length;
  }

  return visibleOffsets;
}

function buildPhraseRows(passage: StudyPageRecord, visibleAnswer: boolean) {
  const rows: PhraseCell[][] = [[]];
  const readings = Array.from(passage.fullKorean).filter(
    (character) => !/\s/.test(character)
  );
  const visibleOffsets = visibleAnswer
    ? null
    : getVisibleOffsets(passage.fullHanja, passage.promptHanja);
  let textOffset = 0;
  let readingIndex = 0;

  for (const hanja of Array.from(passage.fullHanja)) {
    if (hanja === "\n") {
      rows.push([]);
      textOffset += hanja.length;
      continue;
    }

    if (/\s/.test(hanja)) {
      rows[rows.length - 1].push({
        key: `space-${textOffset}`,
        type: "space"
      });
      textOffset += hanja.length;
      continue;
    }

    const reading = readings[readingIndex] ?? "";
    const isVisible = visibleAnswer || visibleOffsets?.has(textOffset) === true;

    rows[rows.length - 1].push({
      hanja,
      key: `character-${textOffset}-${hanja}`,
      reading,
      type: "character",
      visible: isVisible
    });

    readingIndex += 1;
    textOffset += hanja.length;
  }

  return rows.filter((row) => row.length > 0);
}

function readLearnedRecordIds() {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const rawValue = window.localStorage.getItem(LEARNED_RECORD_IDS_KEY);
    const value = rawValue ? JSON.parse(rawValue) : [];

    return new Set(
      Array.isArray(value)
        ? value.filter((recordId): recordId is string => typeof recordId === "string")
        : []
    );
  } catch {
    return new Set<string>();
  }
}

function writeLearnedRecordIds(recordIds: Set<string>) {
  window.localStorage.setItem(
    LEARNED_RECORD_IDS_KEY,
    JSON.stringify(Array.from(recordIds))
  );
}

export function StudyCard({ passages }: StudyCardProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isCharacterMeaningPeeking, setIsCharacterMeaningPeeking] =
    useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [viewMode, setViewMode] = useState<StudyViewMode>("phrase");
  const [learnedRecordIds, setLearnedRecordIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isTurningPage, setIsTurningPage] = useState(false);

  useEffect(() => {
    setLearnedRecordIds(readLearnedRecordIds());
  }, []);

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
  const density = getCardDensity(passage);
  const classes = densityClasses[density];
  const progressPercent = ((currentIndex + 1) / totalPages) * 100;
  const isPhraseMode = viewMode === "phrase";
  const isMeaningMode = viewMode === "meaning";
  const visibleAnswer = isPeeking || isCharacterMeaningPeeking;
  const phraseAnswerVisible = isPhraseMode && visibleAnswer;
  const meaningAnswerVisible = isMeaningMode && isPeeking;
  const maskedTranslation = maskAfterPrompt(
    passage.translation,
    passage.promptTranslation
  );
  const phraseRows = buildPhraseRows(passage, phraseAnswerVisible);
  const isFirstRecord = currentIndex === 0;
  const isLastRecord = currentIndex === totalPages - 1;

  function moveToRecord(nextIndex: number) {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), totalPages - 1);

    if (boundedIndex === currentIndex) {
      return;
    }

    setIsPeeking(false);
    setIsCharacterMeaningPeeking(false);
    setPageIndex(boundedIndex);
    setIsTurningPage(true);
    window.setTimeout(() => setIsTurningPage(false), 220);
  }

  function switchMode(nextMode: StudyViewMode) {
    setIsPeeking(false);
    setIsCharacterMeaningPeeking(false);
    setViewMode(nextMode);
  }

  function markCurrentRecordLearned() {
    const nextLearnedRecordIds = new Set(learnedRecordIds);
    nextLearnedRecordIds.add(passage.id);
    setLearnedRecordIds(nextLearnedRecordIds);
    writeLearnedRecordIds(nextLearnedRecordIds);
  }

  function completeCurrentStep() {
    setIsPeeking(false);
    setIsCharacterMeaningPeeking(false);

    if (viewMode === "phrase") {
      setViewMode("meaning");
      return;
    }

    markCurrentRecordLearned();
    setViewMode("phrase");
    setIsTurningPage(true);

    if (!isLastRecord) {
      setPageIndex((current) => current + 1);
    }

    window.setTimeout(() => setIsTurningPage(false), 220);
  }

  function beginPeek() {
    setIsPeeking(true);
  }

  function endPeek() {
    setIsPeeking(false);
  }

  function beginCharacterMeaningPeek() {
    setIsPeeking(false);
    setIsCharacterMeaningPeeking(true);
  }

  function endCharacterMeaningPeek() {
    setIsCharacterMeaningPeeking(false);
  }

  return (
    <article
      className="study-card relative flex max-h-[calc(100svh-32px)] min-h-[calc(100svh-32px)] w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#121212] p-4 text-white shadow-soft"
      data-state={visibleAnswer ? "open" : "closed"}
      data-turning={isTurningPage ? "true" : "false"}
    >
      <div
        className="book-cover pointer-events-none absolute inset-0 rounded-lg"
        aria-hidden
      />

      {showHelp ? (
        <div className="absolute inset-0 z-30 flex items-start justify-center bg-black/48 px-4 pt-16">
          <div className="w-full max-w-xs rounded-lg border border-[#2A2A2A] bg-[#121212] p-4 text-left shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">도움말</p>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-base font-black text-white transition-colors active:bg-white/14"
                onClick={() => setShowHelp(false)}
                aria-label="도움말 닫기"
              >
                ×
              </button>
            </div>
            <ul className="space-y-2 text-sm font-semibold leading-6 text-white/76">
              <li>길게 누르면 답을 잠깐 볼 수 있어요.</li>
              <li>손을 떼면 다시 가려져요.</li>
              <li>한자 뜻은 아래 문장을 길게 누르면 볼 수 있어요.</li>
            </ul>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <header className="study-card-header shrink-0">
          <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-1.5">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-white/8 text-base font-black text-white transition-colors active:bg-white/12"
              onClick={() => setShowHelp(true)}
              aria-label="도움말 열기"
            >
              ⓘ
            </button>
            <div className="flex min-w-0 items-center justify-center gap-2">
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-white/8 text-base font-black text-white transition-colors active:bg-white/12 disabled:pointer-events-none disabled:opacity-30"
                onClick={() => moveToRecord(currentIndex - 1)}
                disabled={isFirstRecord}
                aria-label="이전 카드"
              >
                ⬅️
              </button>
              <p className="min-w-0 text-center text-base font-bold text-white">
                {passage.page}페이지 · {currentIndex + 1}/{totalPages}
              </p>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-white/8 text-base font-black text-white transition-colors active:bg-white/12 disabled:pointer-events-none disabled:opacity-30"
                onClick={() => moveToRecord(currentIndex + 1)}
                disabled={isLastRecord}
                aria-label="다음 카드"
              >
                ➡️
              </button>
            </div>
            <div className="size-9" aria-hidden />
          </div>

          <div
            className="study-card-progress mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/8"
            aria-label={`${totalPages}개 중 ${currentIndex + 1}번째 학습 카드`}
          >
            <div
              className="h-full rounded-full bg-[rgb(var(--accent))] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        <section
          className={cn(
            "study-page-content relative flex min-h-0 flex-1 flex-col items-center text-center",
            density === "extraLong" ? "justify-start" : "justify-center",
            "touch-manipulation select-none",
            classes.content
          )}
          onPointerCancel={endPeek}
          onPointerDown={beginPeek}
          onPointerLeave={endPeek}
          onPointerUp={endPeek}
        >
          {viewMode === "phrase" ? (
            <div className="flex w-full flex-col gap-3">
              {phraseRows.map((row, rowIndex) => (
                <div
                  className={cn(
                    "flex w-full flex-wrap justify-center",
                    classes.cellGap
                  )}
                  key={`row-${rowIndex}`}
                >
                  {row.map((cell) =>
                    cell.type === "space" ? (
                      <span className="w-2" key={cell.key} aria-hidden />
                    ) : (
                      <span
                        className={cn(
                          "flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-md border border-transparent px-1 py-1.5",
                          classes.cell,
                          classes.cellFrame
                        )}
                        key={cell.key}
                      >
                        {cell.visible ? (
                          <>
                            <span
                              className={cn(
                                "flex min-h-0 flex-1 items-center font-black tracking-normal text-white",
                                classes.hanja
                              )}
                            >
                              {cell.hanja}
                            </span>
                            <span
                              className={cn(
                                "flex h-[1.25em] max-w-full shrink-0 items-center overflow-hidden whitespace-nowrap font-bold text-white/68",
                                classes.reading
                              )}
                            >
                              {cell.reading}
                            </span>
                          </>
                        ) : (
                          <span
                            className={cn(
                              "block w-full rounded bg-white/10",
                              classes.placeholder
                            )}
                            aria-hidden
                          />
                        )}
                      </span>
                    )
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {viewMode === "meaning" ? (
            <div className="relative flex w-full flex-col">
              <p
                className={cn(
                  "invisible w-full max-w-full whitespace-pre-wrap break-keep px-1 font-semibold",
                  classes.translation
                )}
                aria-hidden
              >
                {passage.translation}
              </p>
              <p
                className={cn(
                  "absolute inset-x-0 top-0 w-full max-w-full whitespace-pre-wrap break-keep px-1 font-semibold text-white/84",
                  classes.translation
                )}
              >
                {meaningAnswerVisible ? passage.translation : maskedTranslation}
              </p>
            </div>
          ) : null}

          {isCharacterMeaningPeeking && viewMode === "phrase" ? (
            <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 rounded-lg border border-white/5 bg-black/70 px-3 py-2 text-left shadow-soft backdrop-blur-sm">
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[0.78rem] font-semibold leading-5 text-white/78">
                {passage.characters.map((character) => (
                  <span
                    className="whitespace-normal break-keep"
                    key={`${passage.id}-${character.character}-${character.sound}`}
                  >
                    <span className="font-black text-white">
                      {character.character}
                    </span>{" "}
                    {character.meaning} {character.sound}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <div className="study-card-actions shrink-0">
          {viewMode === "phrase" ? (
            <button
              type="button"
              className="study-character-reference self-center touch-manipulation select-none bg-transparent px-2 py-1 text-xs font-semibold text-white/45 underline underline-offset-4 transition-colors active:text-white/75"
              aria-label="길게 눌러 한자 뜻 보기"
              onPointerCancel={endCharacterMeaningPeek}
              onPointerDown={beginCharacterMeaningPeek}
              onPointerLeave={endCharacterMeaningPeek}
              onPointerUp={endCharacterMeaningPeek}
            >
              한자 뜻도 알고 싶어요.
            </button>
          ) : null}

          <div className="study-mode-switch rounded-lg bg-white/5 p-1">
            <button
              type="button"
              className={cn(
                "study-mode-button min-h-11 rounded-md px-2 text-sm font-black transition-colors",
                viewMode === "phrase"
                  ? "bg-[rgb(var(--accent))] text-black"
                  : "bg-white/8 text-white/70 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => switchMode("phrase")}
            >
              <span className="study-label-full">한자 구절</span>
              <span className="study-label-short">구절</span>
            </button>
            <button
              type="button"
              className={cn(
                "study-mode-button min-h-11 rounded-md px-2 text-sm font-black transition-colors",
                viewMode === "meaning"
                  ? "bg-[rgb(var(--accent))] text-black"
                  : "bg-white/8 text-white/70 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => switchMode("meaning")}
            >
              <span className="study-label-full">한글 바로 뜻</span>
              <span className="study-label-short">바로뜻</span>
            </button>
          </div>

          <button
            type="button"
            className="study-action-button w-full bg-[rgb(var(--accent))] font-black text-black"
            onClick={completeCurrentStep}
          >
            외웠어!
          </button>
        </div>
      </div>
    </article>
  );
}
