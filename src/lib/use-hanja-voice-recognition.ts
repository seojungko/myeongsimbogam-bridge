"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SpeechSupport = "unknown" | "supported" | "unsupported";

type BrowserSpeechRecognitionAlternative = {
  transcript: string;
};

type BrowserSpeechRecognitionResult = {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: BrowserSpeechRecognitionAlternative | undefined;
};

type BrowserSpeechRecognitionResultList = {
  readonly length: number;
  readonly [index: number]: BrowserSpeechRecognitionResult | undefined;
};

type BrowserSpeechRecognitionEvent = {
  readonly resultIndex: number;
  readonly results: BrowserSpeechRecognitionResultList;
};

type BrowserSpeechRecognitionErrorEvent = {
  readonly error: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  abort: () => void;
  start: () => void;
  stop: () => void;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type UseHanjaVoiceRecognitionOptions = {
  enabled: boolean;
  expectedText: string;
  onComplete: () => void;
  onVoiceModeUnavailable?: () => void;
  voiceModeEnabled: boolean;
};

type VoiceUnitMode = "syllable" | "word";

type UseProgressiveVoiceRecognitionOptions = UseHanjaVoiceRecognitionOptions & {
  mode: VoiceUnitMode;
};

type VoiceMatchResult = {
  recognizedCount: number;
  toleranceApplied: boolean;
};

const WEAK_READING_SYLLABLES = new Set([
  "이",
  "지",
  "의",
  "을",
  "를",
  "은",
  "는",
  "에",
  "와",
  "과",
  "도",
  "로",
  "고",
  "며"
]);

const MAX_LOOKAHEAD_GAP = 2;
const MAX_TOLERATED_GAPS = 2;
const RESTART_DELAY_MS = 250;

function optionsUnavailableNoop() {
  // Optional callback used by voice beta screens that can turn the mic mode off.
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function isDocumentVisible() {
  return typeof document === "undefined" || document.visibilityState === "visible";
}

function normalizeKoreanSyllables(value: string) {
  return value.match(/[\uAC00-\uD7A3]/gu)?.join("") ?? "";
}

function normalizeMeaningWord(value: string) {
  return value.match(/[\uAC00-\uD7A30-9]+/gu)?.join("") ?? "";
}

function splitMeaningWords(value: string) {
  return value
    .split(/\s+/u)
    .map(normalizeMeaningWord)
    .filter(Boolean);
}

function countPrefixMatches(expected: string, spoken: string) {
  const maxLength = Math.min(expected.length, spoken.length);
  let count = 0;

  while (count < maxLength && expected[count] === spoken[count]) {
    count += 1;
  }

  return count;
}

function hasStableMatchAfterGap(
  expected: readonly string[],
  heard: readonly string[],
  expectedIndex: number,
  heardIndex: number
) {
  return (
    expected[expectedIndex] === heard[heardIndex] &&
    expected[expectedIndex + 1] !== undefined &&
    heard[heardIndex + 1] !== undefined &&
    expected[expectedIndex + 1] === heard[heardIndex + 1]
  );
}

function canSkipExpectedSyllables(
  expected: readonly string[],
  heard: readonly string[],
  expectedIndex: number,
  heardIndex: number,
  gapSize: number,
  toleratedGapCount: number
) {
  if (
    gapSize < 1 ||
    gapSize > MAX_LOOKAHEAD_GAP ||
    toleratedGapCount + gapSize > MAX_TOLERATED_GAPS
  ) {
    return false;
  }

  const skippedSyllables = expected.slice(expectedIndex, expectedIndex + gapSize);
  const skippedWeakSyllables = skippedSyllables.every((syllable) =>
    WEAK_READING_SYLLABLES.has(syllable)
  );

  if (skippedWeakSyllables) {
    return true;
  }

  return (
    gapSize === 1 &&
    hasStableMatchAfterGap(expected, heard, expectedIndex + gapSize, heardIndex)
  );
}

function countTolerantSyllablePrefixMatches(
  expected: readonly string[],
  heard: readonly string[]
): VoiceMatchResult {
  let expectedIndex = 0;
  let heardIndex = 0;
  let toleratedGapCount = 0;
  let toleranceApplied = false;

  while (expectedIndex < expected.length && heardIndex < heard.length) {
    if (expected[expectedIndex] === heard[heardIndex]) {
      expectedIndex += 1;
      heardIndex += 1;
      continue;
    }

    let matchedWithGap = false;

    for (let gapSize = 1; gapSize <= MAX_LOOKAHEAD_GAP; gapSize += 1) {
      const lookaheadIndex = expectedIndex + gapSize;

      if (
        expected[lookaheadIndex] === heard[heardIndex] &&
        canSkipExpectedSyllables(
          expected,
          heard,
          expectedIndex,
          heardIndex,
          gapSize,
          toleratedGapCount
        )
      ) {
        expectedIndex = lookaheadIndex + 1;
        heardIndex += 1;
        toleratedGapCount += gapSize;
        toleranceApplied = true;
        matchedWithGap = true;
        break;
      }
    }

    if (!matchedWithGap) {
      break;
    }
  }

  return {
    recognizedCount: expectedIndex,
    toleranceApplied
  };
}

function countWordPrefixMatches(expected: readonly string[], spoken: readonly string[]) {
  const maxLength = Math.min(expected.length, spoken.length);
  let count = 0;

  while (count < maxLength && expected[count] === spoken[count]) {
    count += 1;
  }

  return count;
}

function getNextRecognizedCount(
  expected: string,
  spoken: string,
  currentCount: number
): VoiceMatchResult {
  if (spoken.length === 0) {
    return {
      recognizedCount: currentCount,
      toleranceApplied: false
    };
  }

  const expectedUnits = Array.from(expected);
  const spokenUnits = Array.from(spoken);
  const strictFromBeginning = countPrefixMatches(expected, spoken);
  const tolerantFromBeginning = countTolerantSyllablePrefixMatches(
    expectedUnits,
    spokenUnits
  );
  const strictFromCurrent =
    currentCount + countPrefixMatches(expected.slice(currentCount), spoken);
  const tolerantFromCurrent = countTolerantSyllablePrefixMatches(
    expectedUnits.slice(currentCount),
    spokenUnits
  );
  const fromCurrent = {
    recognizedCount: currentCount + tolerantFromCurrent.recognizedCount,
    toleranceApplied: tolerantFromCurrent.toleranceApplied
  };
  const nextCount = Math.min(
    Math.max(
      currentCount,
      strictFromBeginning,
      tolerantFromBeginning.recognizedCount,
      strictFromCurrent,
      fromCurrent.recognizedCount
    ),
    expected.length
  );

  return {
    recognizedCount: nextCount,
    toleranceApplied:
      (nextCount === tolerantFromBeginning.recognizedCount &&
        tolerantFromBeginning.toleranceApplied) ||
      (nextCount === fromCurrent.recognizedCount && fromCurrent.toleranceApplied)
  };
}

function getNextRecognizedWordCount(
  expected: readonly string[],
  spoken: readonly string[],
  currentCount: number
): VoiceMatchResult {
  if (spoken.length === 0) {
    return {
      recognizedCount: currentCount,
      toleranceApplied: false
    };
  }

  const fromBeginning = countWordPrefixMatches(expected, spoken);
  const fromCurrent =
    currentCount +
    countWordPrefixMatches(expected.slice(currentCount), spoken);

  return {
    recognizedCount: Math.min(
      Math.max(currentCount, fromBeginning, fromCurrent),
      expected.length
    ),
    toleranceApplied: false
  };
}

function getExpectedUnits(expectedText: string, mode: VoiceUnitMode) {
  if (mode === "word") {
    return splitMeaningWords(expectedText);
  }

  return Array.from(normalizeKoreanSyllables(expectedText));
}

function normalizeTranscriptForMode(transcript: string, mode: VoiceUnitMode) {
  if (mode === "word") {
    return splitMeaningWords(transcript).join(" ");
  }

  return normalizeKoreanSyllables(transcript);
}

function getComparableTranscript(value: string, mode: VoiceUnitMode) {
  return getExpectedUnits(value, mode).join("\u0001");
}

function mergeTranscriptChunks(
  chunks: readonly string[],
  mode: VoiceUnitMode
) {
  return chunks.reduce((mergedTranscript, chunk) => {
    const nextChunk = chunk.trim();

    if (nextChunk.length === 0) {
      return mergedTranscript;
    }

    if (mergedTranscript.length === 0) {
      return nextChunk;
    }

    const mergedComparable = getComparableTranscript(mergedTranscript, mode);
    const chunkComparable = getComparableTranscript(nextChunk, mode);

    if (
      chunkComparable.length > 0 &&
      (chunkComparable === mergedComparable ||
        chunkComparable.startsWith(mergedComparable))
    ) {
      return nextChunk;
    }

    return `${mergedTranscript} ${nextChunk}`.trim();
  }, "");
}

function getNextCountForMode(
  expectedUnits: readonly string[],
  transcript: string,
  currentCount: number,
  mode: VoiceUnitMode
): VoiceMatchResult {
  if (mode === "word") {
    return getNextRecognizedWordCount(
      expectedUnits,
      splitMeaningWords(transcript),
      currentCount
    );
  }

  return getNextRecognizedCount(
    expectedUnits.join(""),
    normalizeKoreanSyllables(transcript),
    currentCount
  );
}

function useProgressiveVoiceRecognition({
  enabled,
  expectedText,
  mode,
  onComplete,
  onVoiceModeUnavailable,
  voiceModeEnabled
}: UseProgressiveVoiceRecognitionOptions) {
  const expectedUnits = useMemo(
    () => getExpectedUnits(expectedText, mode),
    [expectedText, mode]
  );
  const [support, setSupport] = useState<SpeechSupport>("unknown");
  const [isListening, setIsListening] = useState(false);
  const [recognizedCount, setRecognizedCount] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [liveTranscriptNormalized, setLiveTranscriptNormalized] = useState("");
  const [toleranceApplied, setToleranceApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const recognizedCountRef = useRef(0);
  const finalChunksRef = useRef(new Map<number, string>());
  const completedRef = useRef(false);
  const enabledRef = useRef(enabled);
  const expectedUnitsRef = useRef(expectedUnits);
  const isStartingRef = useRef(false);
  const lastErrorRef = useRef<string | null>(null);
  const onVoiceModeUnavailableRef = useRef(optionsUnavailableNoop);
  const onCompleteRef = useRef(onComplete);
  const previousVoiceModeEnabledRef = useRef(voiceModeEnabled);
  const recognitionGenerationRef = useRef(0);
  const restartTimeoutRef = useRef<number | null>(null);
  const voiceModeEnabledRef = useRef(voiceModeEnabled);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onVoiceModeUnavailableRef.current =
      onVoiceModeUnavailable ?? optionsUnavailableNoop;
  }, [onVoiceModeUnavailable]);

  useEffect(() => {
    enabledRef.current = enabled;
    expectedUnitsRef.current = expectedUnits;
    voiceModeEnabledRef.current = voiceModeEnabled;
  }, [enabled, expectedUnits, voiceModeEnabled]);

  const clearRestartTimer = useCallback(() => {
    if (restartTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = null;
  }, []);

  const canRunRecognition = useCallback(() => {
    return (
      enabledRef.current &&
      voiceModeEnabledRef.current &&
      expectedUnitsRef.current.length > 0 &&
      isDocumentVisible()
    );
  }, []);

  const resetAttempt = useCallback(() => {
    recognizedCountRef.current = 0;
    finalChunksRef.current.clear();
    completedRef.current = false;
    setRecognizedCount(0);
    setFinalTranscript("");
    setInterimTranscript("");
    setLiveTranscript("");
    setLiveTranscriptNormalized("");
    setToleranceApplied(false);
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    clearRestartTimer();
    recognitionGenerationRef.current += 1;
    isStartingRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
  }, [clearRestartTimer]);

  useEffect(() => {
    if (!enabled) {
      stopListening();
      setSupport("unknown");
      resetAttempt();
      return;
    }

    setSupport(getSpeechRecognitionConstructor() ? "supported" : "unsupported");
  }, [enabled, resetAttempt, stopListening]);

  useEffect(() => {
    stopListening();
    resetAttempt();
  }, [expectedUnits, resetAttempt, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (!isDocumentVisible()) {
        stopListening();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stopListening]);

  const startListening = useCallback(() => {
    if (!canRunRecognition() || recognitionRef.current || isStartingRef.current) {
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setSupport("unsupported");
      onVoiceModeUnavailableRef.current();
      return;
    }

    clearRestartTimer();
    isStartingRef.current = true;
    lastErrorRef.current = null;
    const generation = recognitionGenerationRef.current + 1;
    recognitionGenerationRef.current = generation;
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let nextInterimTranscript = "";

      for (
        let resultIndex = event.resultIndex;
        resultIndex < event.results.length;
        resultIndex += 1
      ) {
        const result = event.results[resultIndex];
        const transcriptChunk = result?.[0]?.transcript.trim() ?? "";

        if (transcriptChunk.length === 0) {
          continue;
        }

        if (result?.isFinal) {
          finalChunksRef.current.set(resultIndex, transcriptChunk);
          continue;
        }

        nextInterimTranscript = transcriptChunk;
      }

      const nextFinalTranscript = mergeTranscriptChunks(
        Array.from(finalChunksRef.current.entries())
          .sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
          .map(([, transcriptChunk]) => transcriptChunk),
        mode
      );
      const nextLiveTranscript = mergeTranscriptChunks(
        [nextFinalTranscript, nextInterimTranscript],
        mode
      );
      const normalizedTranscript = normalizeTranscriptForMode(
        nextLiveTranscript,
        mode
      );
      const nextMatch = getNextCountForMode(
        expectedUnits,
        nextLiveTranscript,
        recognizedCountRef.current,
        mode
      );
      const nextCount = nextMatch.recognizedCount;

      setFinalTranscript(nextFinalTranscript);
      setInterimTranscript(nextInterimTranscript);
      setLiveTranscript(nextLiveTranscript);
      setLiveTranscriptNormalized(normalizedTranscript);
      setToleranceApplied(nextMatch.toleranceApplied);

      if (nextCount > recognizedCountRef.current) {
        recognizedCountRef.current = nextCount;
        setRecognizedCount(nextCount);
      }

      if (nextCount >= expectedUnits.length && !completedRef.current) {
        completedRef.current = true;
        clearRestartTimer();
        recognitionGenerationRef.current += 1;
        recognition.abort();
        recognitionRef.current = null;
        setIsListening(false);
        onCompleteRef.current();
      }
    };

    recognition.onerror = (event) => {
      lastErrorRef.current = event.error;
      setError(event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "audio-capture"
      ) {
        clearRestartTimer();
        recognitionGenerationRef.current += 1;
        recognitionRef.current?.abort();
        recognitionRef.current = null;
        setIsListening(false);
        onVoiceModeUnavailableRef.current();
      }
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      setIsListening(false);

      if (recognitionGenerationRef.current !== generation) {
        return;
      }

      recognitionRef.current = null;

      if (completedRef.current || !canRunRecognition()) {
        return;
      }

      const lastError = lastErrorRef.current;

      if (
        lastError &&
        lastError !== "no-speech" &&
        lastError !== "aborted"
      ) {
        onVoiceModeUnavailableRef.current();
        return;
      }

      clearRestartTimer();
      restartTimeoutRef.current = window.setTimeout(() => {
        restartTimeoutRef.current = null;
        startListening();
      }, RESTART_DELAY_MS);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setSupport("supported");
      setIsListening(true);
      setError(null);
    } catch {
      isStartingRef.current = false;
      recognitionRef.current = null;
      setIsListening(false);
      setError("start-failed");
      onVoiceModeUnavailableRef.current();
    }
  }, [canRunRecognition, clearRestartTimer, expectedUnits, mode]);

  useEffect(() => {
    const wasVoiceModeEnabled = previousVoiceModeEnabledRef.current;
    previousVoiceModeEnabledRef.current = voiceModeEnabled;

    if (!voiceModeEnabled) {
      stopListening();
      return;
    }

    if (!wasVoiceModeEnabled) {
      resetAttempt();
    }

    if (!enabled) {
      return;
    }

    startListening();
  }, [enabled, resetAttempt, startListening, stopListening, voiceModeEnabled]);

  const debugRevealAll = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    completedRef.current = true;
    recognizedCountRef.current = expectedUnits.length;
    finalChunksRef.current.clear();
    finalChunksRef.current.set(0, expectedUnits.join(mode === "word" ? " " : ""));
    setIsListening(false);
    setRecognizedCount(expectedUnits.length);
    setFinalTranscript(finalChunksRef.current.get(0) ?? "");
    setInterimTranscript("");
    setLiveTranscript(finalChunksRef.current.get(0) ?? "");
    setLiveTranscriptNormalized(finalChunksRef.current.get(0) ?? "");
    setToleranceApplied(false);
  }, [expectedUnits, mode]);

  return {
    debugRevealAll,
    error,
    expectedNormalized: expectedUnits.join(mode === "word" ? " " : ""),
    finalTranscript,
    interimTranscript,
    isListening,
    liveTranscript,
    liveTranscriptNormalized,
    recognizedCount,
    recognizedIndices: Array.from(
      { length: recognizedCount },
      (_, index) => index
    ),
    startListening,
    stopListening,
    support,
    targetCount: expectedUnits.length,
    toleranceApplied
  };
}

export function useHanjaVoiceRecognition(
  options: UseHanjaVoiceRecognitionOptions
) {
  return useProgressiveVoiceRecognition({
    ...options,
    mode: "syllable"
  });
}

export function useKoreanMeaningVoiceRecognition(
  options: UseHanjaVoiceRecognitionOptions
) {
  return useProgressiveVoiceRecognition({
    ...options,
    mode: "word"
  });
}
