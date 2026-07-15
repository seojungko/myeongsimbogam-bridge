"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  useHanjaVoiceRecognition,
  useKoreanMeaningVoiceRecognition
} from "@/lib/use-hanja-voice-recognition";
import { useVoiceBeta } from "@/lib/use-voice-beta";
import type { StudyPageRecord } from "@dataset/types";

type StudyCardProps = {
  passages: readonly StudyPageRecord[];
};

type StudyViewMode = "phrase" | "meaning";
type CardDensity = "short" | "medium" | "long" | "extraLong";
type HanjaSizeTier = "large" | "mediumLarge" | "medium" | "compact";
type MaskedTranslationPart =
  | {
      key: string;
      type: "cover";
      value: string;
      voiceIndex: number | null;
      widthEm: number;
    }
  | {
      key: string;
      type: "space";
      value: string;
    }
  | {
      key: string;
      type: "visible";
      value: string;
      voiceIndex: number | null;
    };
type PhraseCell =
  | {
      cueVisible: boolean;
      hanja: string;
      key: string;
      reading: string;
      recognized: boolean;
      type: "character";
    }
  | {
      key: string;
      type: "space";
    };
type PhraseRow = {
  cells: PhraseCell[];
  key: string;
};
type PhraseLayout = {
  rows: PhraseRow[];
  sizeTier: HanjaSizeTier;
};
type PageRangeSummary = {
  count: number;
  end: number;
  firstIndex: number;
  label: string;
  start: number;
};
type RangeCelebration = {
  headline: string;
  rangeLabel: string;
  secondary: string;
};

const LEARNED_RECORD_IDS_KEY = "bridge.learnedRecordIds";
const VOICE_BETA_INTRO_SEEN_KEY = "voiceBetaIntroSeen";
const COMPLETION_SPARKLE_MS = 560;
const RANGE_CELEBRATION_HEADLINES = [
  "대단해!",
  "정말 잘했어!",
  "와, 이걸 해내다니!",
  "정말 대단해!",
  "멋지게 통과!",
  "최고야!",
  "역시, 잘 해낼 줄 알았어!"
];

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

const hanjaSizeClasses: Record<
  HanjaSizeTier,
  {
    cell: string;
    cellGap: string;
    cellFrame: string;
    hanja: string;
    padding: string;
    reading: string;
    row: string;
    rowGap: string;
    space: string;
  }
> = {
  large: {
    cell: "w-[2.16rem]",
    cellGap: "gap-x-1.5",
    cellFrame: "h-[4.1rem]",
    hanja: "text-[clamp(1.5rem,6.2vw,2.05rem)] leading-none",
    padding: "px-1 py-1.5",
    reading: "text-[clamp(0.78rem,3vw,0.98rem)] leading-tight",
    row: "flex-nowrap",
    rowGap: "gap-3",
    space: "w-2"
  },
  mediumLarge: {
    cell: "w-[1.84rem]",
    cellGap: "gap-x-1",
    cellFrame: "h-[3.65rem]",
    hanja: "text-[clamp(1.3rem,5.2vw,1.74rem)] leading-none",
    padding: "px-0.5 py-1",
    reading: "text-[clamp(0.72rem,2.8vw,0.9rem)] leading-tight",
    row: "flex-nowrap",
    rowGap: "gap-2.5",
    space: "w-1.5"
  },
  medium: {
    cell: "w-[1.62rem]",
    cellGap: "gap-x-0.5",
    cellFrame: "h-[3.3rem]",
    hanja: "text-[clamp(1.16rem,4.8vw,1.54rem)] leading-none",
    padding: "px-0.5 py-1",
    reading: "text-[clamp(0.66rem,2.55vw,0.82rem)] leading-tight",
    row: "flex-nowrap",
    rowGap: "gap-2",
    space: "w-1"
  },
  compact: {
    cell: "w-[1.44rem]",
    cellGap: "gap-x-1 gap-y-1.5",
    cellFrame: "h-[2.9rem]",
    hanja: "text-[clamp(1.02rem,4vw,1.35rem)] leading-none",
    padding: "px-0.5 py-1",
    reading: "text-[clamp(0.62rem,2.3vw,0.74rem)] leading-tight",
    row: "flex-wrap",
    rowGap: "gap-1.5",
    space: "w-1.5"
  }
};

function countVisibleCharacters(value: string) {
  return Array.from(value).filter((character) => !/\s/.test(character)).length;
}

function getPageRangeEnd(page: number) {
  return Math.max(20, Math.ceil(page / 20) * 20);
}

function getPageRangeLabel(rangeEnd: number) {
  return `~${rangeEnd}쪽`;
}

function getPageRangeStart(rangeEnd: number) {
  return rangeEnd - 19;
}

function buildPageRangeSummaries(passages: readonly StudyPageRecord[]) {
  const ranges = new Map<number, PageRangeSummary>();

  passages.forEach((passage, index) => {
    const rangeEnd = getPageRangeEnd(passage.page);
    const existingRange = ranges.get(rangeEnd);

    if (existingRange) {
      existingRange.count += 1;
      return;
    }

    ranges.set(rangeEnd, {
      count: 1,
      end: rangeEnd,
      firstIndex: index,
      label: getPageRangeLabel(rangeEnd),
      start: getPageRangeStart(rangeEnd)
    });
  });

  return Array.from(ranges.values()).sort((a, b) => a.end - b.end);
}

function pickRandomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildRangeCelebration(rangeLabel: string): RangeCelebration {
  const secondaryOptions = [`${rangeLabel}까지 해냈어.`, "한 묶음을 끝냈어."];

  return {
    headline: pickRandomItem(RANGE_CELEBRATION_HEADLINES),
    rangeLabel,
    secondary: pickRandomItem(secondaryOptions)
  };
}

function vibrateForRangeCompletion() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([25, 70, 35, 90, 55]);
  }
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

function countHanjaCells(cells: PhraseCell[]) {
  return cells.filter((cell) => cell.type === "character").length;
}

function splitPhraseRow(cells: PhraseCell[]) {
  if (countHanjaCells(cells) <= 9) {
    return [cells];
  }

  const phrases: PhraseCell[][] = [];
  let currentPhrase: PhraseCell[] = [];

  cells.forEach((cell) => {
    if (cell.type === "space") {
      if (currentPhrase.length > 0) {
        phrases.push(currentPhrase);
        currentPhrase = [];
      }

      return;
    }

    currentPhrase.push(cell);
  });

  if (currentPhrase.length > 0) {
    phrases.push(currentPhrase);
  }

  if (phrases.length <= 1) {
    return [cells];
  }

  const visualRows: PhraseCell[][] = [];
  let currentRow: PhraseCell[] = [];
  let currentCount = 0;

  phrases.forEach((phrase, phraseIndex) => {
    const phraseCount = countHanjaCells(phrase);
    const canJoin = currentCount > 0 && currentCount + phraseCount <= 9;

    if (currentRow.length === 0) {
      currentRow = [...phrase];
      currentCount = phraseCount;
      return;
    }

    if (canJoin) {
      currentRow.push(
        {
          key: `visual-space-${visualRows.length}-${phraseIndex}`,
          type: "space"
        },
        ...phrase
      );
      currentCount += phraseCount;
      return;
    }

    visualRows.push(currentRow);
    currentRow = [...phrase];
    currentCount = phraseCount;
  });

  if (currentRow.length > 0) {
    visualRows.push(currentRow);
  }

  return visualRows;
}

function getHanjaSizeTier(rows: PhraseRow[]): HanjaSizeTier {
  const maxCharacterCount = Math.max(
    ...rows.map((row) => countHanjaCells(row.cells)),
    0
  );

  if (maxCharacterCount <= 7) {
    return "large";
  }

  if (maxCharacterCount === 8) {
    return "mediumLarge";
  }

  if (maxCharacterCount === 9) {
    return "medium";
  }

  return "compact";
}

function buildPhraseLayout(
  passage: StudyPageRecord,
  visibleAnswer: boolean,
  recognizedVoiceUnits: number
): PhraseLayout {
  const rows: PhraseCell[][] = [[]];
  const readings = passage.fullKorean.match(/[\uAC00-\uD7A3]/gu) ?? [];
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
    const isCueVisible =
      visibleAnswer || visibleOffsets?.has(textOffset) === true;
    const isRecognized =
      reading.length > 0 && readingIndex < recognizedVoiceUnits;

    rows[rows.length - 1].push({
      cueVisible: isCueVisible,
      hanja,
      key: `character-${textOffset}-${hanja}`,
      reading,
      recognized: isRecognized,
      type: "character"
    });

    readingIndex += 1;
    textOffset += hanja.length;
  }

  const visualRows = rows
    .filter((row) => row.length > 0)
    .flatMap((row) => splitPhraseRow(row))
    .map((row, rowIndex): PhraseRow => ({
      cells: row,
      key: `row-${rowIndex}`
    }));

  return {
    rows: visualRows,
    sizeTier: getHanjaSizeTier(visualRows)
  };
}

function getCoverWidthEm(value: string) {
  const visibleCharacters = Array.from(value).filter(
    (character) => !/\s/.test(character)
  ).length;

  return Math.min(Math.max(visibleCharacters * 0.5, 1.2), 6.8);
}

function normalizeMeaningToken(value: string) {
  return value.match(/[\uAC00-\uD7A30-9]+/gu)?.join("") ?? "";
}

function buildMaskedTranslationParts(
  fullText: string,
  prompt: string,
  answerVisible: boolean
) {
  const parts: MaskedTranslationPart[] = [];
  const tokens = fullText.match(/\s+|\S+/gu) ?? [];
  const promptIndex = prompt.length > 0 ? fullText.indexOf(prompt) : -1;
  let textOffset = 0;
  let voiceIndex = 0;

  tokens.forEach((token, index) => {
    if (/^\s+$/u.test(token)) {
      parts.push({
        key: `space-${index}-${textOffset}`,
        type: "space",
        value: token
      });
      textOffset += token.length;
      return;
    }

    const normalizedToken = normalizeMeaningToken(token);
    const tokenVoiceIndex = normalizedToken.length > 0 ? voiceIndex : null;
    const tokenStartsInPrompt =
      promptIndex >= 0 &&
      textOffset >= promptIndex &&
      textOffset < promptIndex + prompt.length;
    const tokenEndsInPrompt =
      promptIndex >= 0 &&
      textOffset + token.length > promptIndex &&
      textOffset + token.length <= promptIndex + prompt.length;
    const shouldShowText =
      answerVisible || tokenStartsInPrompt || tokenEndsInPrompt;

    if (shouldShowText) {
      parts.push({
        key: `visible-${index}-${textOffset}`,
        type: "visible" as const,
        value: token,
        voiceIndex: tokenVoiceIndex
      });
    } else {
      parts.push({
        key: `cover-${index}-${textOffset}`,
        type: "cover",
        value: token,
        voiceIndex: tokenVoiceIndex,
        widthEm: getCoverWidthEm(token)
      });
    }

    if (normalizedToken.length > 0) {
      voiceIndex += 1;
    }

    textOffset += token.length;
  });

  return parts;
}

function getMeaningText(passage: StudyPageRecord) {
  return passage.directMeaning || passage.translation;
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
  const isVoiceBetaEnabled = useVoiceBeta();
  const completionTimeoutRef = useRef<number | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [completionSparkleRecordId, setCompletionSparkleRecordId] = useState<
    string | null
  >(null);
  const [isCompletingRecord, setIsCompletingRecord] = useState(false);
  const [isCharacterMeaningPeeking, setIsCharacterMeaningPeeking] =
    useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [showVoiceIntro, setShowVoiceIntro] = useState(false);
  const [rangeCelebration, setRangeCelebration] =
    useState<RangeCelebration | null>(null);
  const [showRangeSheet, setShowRangeSheet] = useState(false);
  const [viewMode, setViewMode] = useState<StudyViewMode>("phrase");
  const [learnedRecordIds, setLearnedRecordIds] = useState<Set<string>>(
    () => new Set()
  );
  const [isTurningPage, setIsTurningPage] = useState(false);

  useEffect(() => {
    setLearnedRecordIds(readLearnedRecordIds());
  }, []);

  useEffect(() => {
    if (!isVoiceBetaEnabled) {
      setShowVoiceIntro(false);
      return;
    }

    try {
      setShowVoiceIntro(
        window.localStorage.getItem(VOICE_BETA_INTRO_SEEN_KEY) !== "true"
      );
    } catch {
      setShowVoiceIntro(true);
    }
  }, [isVoiceBetaEnabled]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  const totalPages = passages.length;
  const voicePassage =
    passages[Math.min(pageIndex, Math.max(totalPages - 1, 0))];
  const voiceMeaningText = voicePassage ? getMeaningText(voicePassage) : "";
  const hanjaVoiceRecognition = useHanjaVoiceRecognition({
    enabled:
      isVoiceBetaEnabled &&
      viewMode === "phrase" &&
      !isCompletingRecord &&
      totalPages > 0,
    expectedText: voicePassage?.fullKorean ?? "",
    onComplete: completeCurrentStep
  });
  const meaningVoiceRecognition = useKoreanMeaningVoiceRecognition({
    enabled:
      isVoiceBetaEnabled &&
      viewMode === "meaning" &&
      !isCompletingRecord &&
      totalPages > 0,
    expectedText: voiceMeaningText,
    onComplete: completeCurrentStep
  });

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
  const pageRanges = buildPageRangeSummaries(passages);
  const currentRangeEnd = getPageRangeEnd(passage.page);
  const currentRangeStart = getPageRangeStart(currentRangeEnd);
  const currentRangeLabel = getPageRangeLabel(currentRangeEnd);
  const currentRangeRecords = passages.filter(
    (record) => record.page >= currentRangeStart && record.page <= currentRangeEnd
  );
  const currentRangePosition = Math.max(
    currentRangeRecords.findIndex((record) => record.id === passage.id),
    0
  );
  const isPhraseMode = viewMode === "phrase";
  const isMeaningMode = viewMode === "meaning";
  const visibleAnswer = isPeeking || isCharacterMeaningPeeking;
  const phraseAnswerVisible = isPhraseMode && visibleAnswer;
  const meaningAnswerVisible = isMeaningMode && isPeeking;
  const meaningText = getMeaningText(passage);
  const maskedTranslationParts = buildMaskedTranslationParts(
    meaningText,
    passage.promptTranslation,
    meaningAnswerVisible
  );
  const phraseLayout = buildPhraseLayout(
    passage,
    phraseAnswerVisible,
    isVoiceBetaEnabled ? hanjaVoiceRecognition.recognizedCount : 0
  );
  const phraseCells = phraseLayout.rows.flatMap((row) =>
    row.cells.filter((cell) => cell.type === "character")
  );
  const visualUnitCount = phraseCells.length;
  const cueVisibleCount = phraseCells.filter((cell) => cell.cueVisible).length;
  const hanjaClasses = hanjaSizeClasses[phraseLayout.sizeTier];
  const isFirstRecord = currentIndex === 0;
  const isLastRecord = currentIndex === totalPages - 1;
  const isLastRecordInCurrentRange =
    currentRangePosition === currentRangeRecords.length - 1;
  const activeVoiceRecognition = isMeaningMode
    ? meaningVoiceRecognition
    : hanjaVoiceRecognition;
  const isVoiceControlUnavailable =
    activeVoiceRecognition.support === "unsupported";
  const isVoiceListening = activeVoiceRecognition.isListening;

  function dismissVoiceIntro() {
    try {
      window.localStorage.setItem(VOICE_BETA_INTRO_SEEN_KEY, "true");
    } catch {
      // Keep the guidance lightweight even when storage is unavailable.
    }

    setShowVoiceIntro(false);
  }

  function toggleVoiceListening() {
    if (!isVoiceBetaEnabled || isVoiceControlUnavailable) {
      return;
    }

    if (activeVoiceRecognition.isListening) {
      activeVoiceRecognition.stopListening();
      return;
    }

    activeVoiceRecognition.startListening();
  }

  function moveToRecord(nextIndex: number) {
    if (isCompletingRecord) {
      return;
    }

    const boundedIndex = Math.min(Math.max(nextIndex, 0), totalPages - 1);

    if (boundedIndex === currentIndex) {
      return;
    }

    hanjaVoiceRecognition.stopListening();
    meaningVoiceRecognition.stopListening();
    setIsPeeking(false);
    setIsCharacterMeaningPeeking(false);
    setShowRangeSheet(false);
    setPageIndex(boundedIndex);
    setIsTurningPage(true);
    window.setTimeout(() => setIsTurningPage(false), 220);
  }

  function moveToRange(range: PageRangeSummary) {
    moveToRecord(range.firstIndex);
    setShowRangeSheet(false);
  }

  function switchMode(nextMode: StudyViewMode) {
    hanjaVoiceRecognition.stopListening();
    meaningVoiceRecognition.stopListening();
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

  function finishCompletedRecord() {
    setCompletionSparkleRecordId(null);
    setRangeCelebration(null);
    setIsCompletingRecord(false);
    setViewMode("phrase");
    setIsTurningPage(true);

    if (!isLastRecord) {
      setPageIndex((current) => Math.min(current + 1, totalPages - 1));
    }

    window.setTimeout(() => setIsTurningPage(false), 220);
    completionTimeoutRef.current = null;
  }

  function closeRangeCelebration() {
    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
    }

    finishCompletedRecord();
  }

  function getDotStyle(rangeIndex: number) {
    return { "--dot-index": rangeIndex } as CSSProperties;
  }

  function getParticleStyle(particleIndex: number) {
    return { "--particle-index": particleIndex } as CSSProperties;
  }

  function getParticleClassName(particleIndex: number) {
    const positions = [
      "left-[18%] top-[20%]",
      "right-[18%] top-[22%]",
      "left-[14%] bottom-[28%]",
      "right-[15%] bottom-[30%]",
      "left-[48%] top-[12%]",
      "right-[42%] bottom-[16%]"
    ];

    return positions[particleIndex] ?? "left-1/2 top-1/2";
  }

  function completeCurrentStep() {
    if (isCompletingRecord) {
      return;
    }

    hanjaVoiceRecognition.stopListening();
    meaningVoiceRecognition.stopListening();
    setIsPeeking(false);
    setIsCharacterMeaningPeeking(false);

    if (viewMode === "phrase") {
      setViewMode("meaning");
      return;
    }

    markCurrentRecordLearned();
    setCompletionSparkleRecordId(passage.id);
    setIsCompletingRecord(true);
    const shouldCelebrateRange = isLastRecordInCurrentRange;

    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
    }

    if (shouldCelebrateRange) {
      setRangeCelebration(buildRangeCelebration(currentRangeLabel));
      vibrateForRangeCompletion();

      completionTimeoutRef.current = window.setTimeout(() => {
        setCompletionSparkleRecordId(null);
        completionTimeoutRef.current = null;
      }, COMPLETION_SPARKLE_MS);
      return;
    }

    completionTimeoutRef.current = window.setTimeout(() => {
      finishCompletedRecord();
    }, COMPLETION_SPARKLE_MS);
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

      {showVoiceIntro ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 px-5">
          <div className="w-full max-w-xs rounded-2xl border border-white/5 bg-[#121212]/95 p-5 text-center shadow-soft">
            <p className="whitespace-pre-line text-[0.95rem] font-bold leading-7 text-white/86">
              {`'처음 만나는 명심보감' 책의
암기를 돕기 위한 앱이에요.

카드 영역을 길게 누르면
가려진 글자가 보여요.

마이크를 켜고 소리내어 읽으면
맞힌 글자가 파란색으로 변해요.`}
            </p>
            <button
              type="button"
              className="mt-5 min-h-11 rounded-full bg-[rgb(var(--accent))] px-6 text-sm font-black text-black transition active:scale-[0.98]"
              onClick={dismissVoiceIntro}
            >
              화이팅🎉
            </button>
          </div>
        </div>
      ) : null}

      {showRangeSheet ? (
        <div className="absolute inset-0 z-30 flex items-end bg-black/50">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowRangeSheet(false)}
            aria-label="쪽 범위 선택 닫기"
          />
          <div className="relative w-full rounded-t-2xl border border-white/5 bg-[#121212]/95 p-4 pb-5 text-white shadow-soft backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-base font-black">어디까지 볼까요?</p>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-white/8 text-base font-black text-white transition-colors active:bg-white/12"
                onClick={() => setShowRangeSheet(false)}
                aria-label="쪽 범위 선택 닫기"
              >
                ×
              </button>
            </div>
            <div className="space-y-1">
              {pageRanges.map((range) => {
                const isCurrentRange = range.end === currentRangeEnd;

                return (
                  <button
                    type="button"
                    className={cn(
                      "grid min-h-11 w-full grid-cols-[4.25rem_1fr_4rem] items-center rounded-lg px-3 text-left text-sm font-bold transition-colors",
                      isCurrentRange
                        ? "bg-[rgb(var(--accent)/0.16)] text-white"
                        : "bg-white/5 text-white/72 active:bg-white/10"
                    )}
                    key={range.end}
                    onClick={() => moveToRange(range)}
                  >
                    <span className="font-black">{range.label}</span>
                    <span className="text-white/58">
                      {range.start}~{range.end}쪽
                    </span>
                    <span className="text-right text-white/64">
                      {range.count}구문
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {rangeCelebration ? (
        <div className="study-range-celebration absolute inset-0 z-40 flex items-center justify-center bg-black/62 px-5">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={closeRangeCelebration}
            aria-label="축하 닫기"
          />
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: 6 }).map((_, particleIndex) => (
              <span
                className={cn(
                  "study-range-particle absolute",
                  getParticleClassName(particleIndex)
                )}
                key={particleIndex}
                style={getParticleStyle(particleIndex)}
              />
            ))}
          </div>
          <div className="study-range-celebration-card relative w-full max-w-[19rem] rounded-2xl px-6 py-7 text-center">
            <p className="text-[clamp(1.45rem,7vw,2rem)] font-black leading-tight text-white">
              {rangeCelebration.headline}
            </p>
            <p className="text-base font-bold leading-7 text-white/72">
              {rangeCelebration.secondary}
            </p>
            <button
              type="button"
              className="mx-auto mt-2 inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-2xl transition-colors active:scale-[0.98] active:bg-white/16"
              onClick={closeRangeCelebration}
              aria-label="축하 닫기"
            >
              😊
            </button>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <header className="study-card-header shrink-0">
          <div className="relative min-h-9">
            {isVoiceBetaEnabled ? (
              <button
                type="button"
                className={cn(
                  "absolute left-0 top-0 flex size-9 items-center justify-center rounded-full transition",
                  isVoiceListening
                    ? "animate-pulse bg-[rgb(var(--accent)/0.2)] text-[rgb(var(--accent))] shadow-[0_0_18px_rgb(var(--accent)/0.18)]"
                    : "bg-white/8 text-white/82 active:bg-white/12",
                  isVoiceControlUnavailable &&
                    "pointer-events-none opacity-35"
                )}
                onClick={toggleVoiceListening}
                aria-label={
                  isVoiceListening ? "음성 확인 끄기" : "음성 확인 켜기"
                }
                aria-pressed={isVoiceListening}
                disabled={isVoiceControlUnavailable}
              >
                <Mic className="size-4" aria-hidden />
              </button>
            ) : null}
            <div className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center gap-1.5 whitespace-nowrap">
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border border-white/5 bg-white/10 text-base font-black text-white/92 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors active:bg-white/16 disabled:pointer-events-none disabled:opacity-30"
                onClick={() => moveToRecord(currentIndex - 1)}
                disabled={isFirstRecord}
                aria-label="이전 카드"
              >
                ←
              </button>
              <p className="text-center text-[0.95rem] font-bold text-white">
                {passage.page}쪽 · {currentIndex + 1}번째
              </p>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border border-white/5 bg-white/10 text-base font-black text-white/92 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors active:bg-white/16 disabled:pointer-events-none disabled:opacity-30"
                onClick={() => moveToRecord(currentIndex + 1)}
                disabled={isLastRecord}
                aria-label="다음 카드"
              >
                →
              </button>
            </div>
            <button
              type="button"
              className="absolute right-0 top-0 flex h-9 items-center rounded-full border border-white/5 bg-white/10 px-3.5 text-xs font-black text-white/92 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] transition-colors active:bg-white/16 active:text-white"
              onClick={() => setShowRangeSheet(true)}
              aria-label={`${currentRangeLabel} 범위 선택`}
            >
              {currentRangeLabel}
            </button>
          </div>

          <div
            className="mt-1.5 flex justify-center"
            aria-label={`${currentRangeLabel} 범위 안 ${currentRangeRecords.length}개 구문 중 ${currentRangePosition + 1}번째`}
          >
            <div
              className="study-range-dots flex items-center justify-center gap-0.5"
              data-shimmer={rangeCelebration ? "true" : undefined}
            >
              {currentRangeRecords.map((record, rangeIndex) => {
                const isCurrent = rangeIndex === currentRangePosition;
                const isBefore = rangeIndex < currentRangePosition;
                const isSparkling = completionSparkleRecordId === record.id;

                return (
                  <span
                    className="study-range-dot relative flex size-3.5 items-center justify-center"
                    data-sparkle={isSparkling ? "true" : undefined}
                    key={record.id}
                    style={getDotStyle(rangeIndex)}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "study-range-dot-core block rounded-full transition-colors",
                        isCurrent
                          ? "size-2.5 bg-[rgb(var(--accent))]"
                          : "size-1.5",
                        !isCurrent && (isBefore ? "bg-white/50" : "bg-white/24")
                      )}
                    />
                    {isSparkling ? (
                      <span className="study-range-dot-glint" aria-hidden />
                    ) : null}
                  </span>
                );
              })}
            </div>
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
            <div className={cn("flex w-full flex-col", hanjaClasses.rowGap)}>
              {phraseLayout.rows.map((row) => (
                <div
                  className={cn(
                    "flex w-full justify-center",
                    hanjaClasses.cellGap,
                    hanjaClasses.row
                  )}
                  key={row.key}
                >
                  {row.cells.map((cell) => {
                    if (cell.type === "space") {
                      return (
                        <span
                          className={hanjaClasses.space}
                          key={cell.key}
                          aria-hidden
                        />
                      );
                    }

                    const shouldRenderActualCell =
                      cell.recognized || cell.cueVisible;

                    return (
                      <span
                        className={cn(
                          "flex shrink-0 flex-col items-center justify-between overflow-hidden rounded-md border border-transparent",
                          hanjaClasses.padding,
                          hanjaClasses.cell,
                          hanjaClasses.cellFrame
                        )}
                        key={cell.key}
                      >
                        {shouldRenderActualCell ? (
                          <>
                            <span
                              className={cn(
                                "flex min-h-0 flex-1 items-center font-black tracking-normal",
                                cell.recognized
                                  ? "text-[rgb(var(--accent))]"
                                  : "text-white",
                                hanjaClasses.hanja
                              )}
                            >
                              {cell.hanja}
                            </span>
                            <span
                              className={cn(
                                "flex h-[1.25em] max-w-full shrink-0 items-center overflow-hidden whitespace-nowrap font-bold",
                                cell.recognized
                                  ? "text-[rgb(var(--accent))]"
                                  : "text-white/68",
                                hanjaClasses.reading
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
                    );
                  })}
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
                {meaningText}
              </p>
              <div
                className={cn(
                  "absolute inset-x-0 top-0 w-full max-w-full whitespace-pre-wrap break-keep px-1 font-semibold text-white/84",
                  classes.translation
                )}
              >
                {maskedTranslationParts.map((part) => {
                      if (part.type === "visible") {
                        const isMeaningVoiceRecognized =
                          isVoiceBetaEnabled &&
                          part.voiceIndex !== null &&
                          part.voiceIndex <
                            meaningVoiceRecognition.recognizedCount;

                        return (
                          <span
                            className={
                              isMeaningVoiceRecognized
                                ? "text-[rgb(var(--accent))]"
                                : "text-white/88"
                            }
                            key={part.key}
                          >
                            {part.value}
                          </span>
                        );
                      }

                      if (part.type === "space") {
                        return <span key={part.key}>{part.value}</span>;
                      }

                      const isMeaningVoiceRecognized =
                        isVoiceBetaEnabled &&
                        part.voiceIndex !== null &&
                        part.voiceIndex <
                          meaningVoiceRecognition.recognizedCount;

                      if (isMeaningVoiceRecognized) {
                        return (
                          <span
                            className="text-[rgb(var(--accent))]"
                            key={part.key}
                          >
                            {part.value}
                          </span>
                        );
                      }

                      return (
                        <span
                          className="rounded bg-white/10 text-transparent"
                          key={part.key}
                          aria-hidden
                        >
                          {part.value}
                        </span>
                      );
                    })}
              </div>
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
          {isVoiceBetaEnabled && viewMode === "phrase" ? (
            <div className="rounded-lg bg-white/5 px-2.5 py-2 text-left text-[0.62rem] font-semibold leading-4 text-white/42">
              <p className="font-black text-white/58">Voice Debug</p>
              <p className="truncate">
                target: {hanjaVoiceRecognition.expectedNormalized || "-"}
              </p>
              <p className="truncate">
                live: {hanjaVoiceRecognition.liveTranscriptNormalized || "-"}
              </p>
              <p className="truncate">
                final: {hanjaVoiceRecognition.finalTranscript || "-"}
              </p>
              <p className="truncate">
                interim: {hanjaVoiceRecognition.interimTranscript || "-"}
              </p>
              <p>
                progress: {hanjaVoiceRecognition.recognizedCount} /{" "}
                {hanjaVoiceRecognition.targetCount}
              </p>
              <p>visualUnits: {visualUnitCount}</p>
              <p>
                recognized: [
                {hanjaVoiceRecognition.recognizedIndices.join(",")}]
              </p>
              <p>
                tolerance:{" "}
                {hanjaVoiceRecognition.toleranceApplied ? "applied" : "off"}
              </p>
              <p>cue: {cueVisibleCount}</p>
              <button
                type="button"
                className="mt-1 rounded-full bg-white/8 px-2 py-1 text-[0.62rem] font-black text-white/64 transition active:bg-white/12"
                onClick={hanjaVoiceRecognition.debugRevealAll}
              >
                Debug reveal all
              </button>
            </div>
          ) : null}

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
            className="study-action-button w-full bg-[rgb(var(--accent))] font-black text-black active:scale-[0.99] active:brightness-105 disabled:pointer-events-none"
            disabled={isCompletingRecord}
            onClick={completeCurrentStep}
          >
            외웠어!
          </button>
        </div>
      </div>
    </article>
  );
}
