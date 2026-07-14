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
};

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

function normalizeKoreanSyllables(value: string) {
  return value.match(/[\uAC00-\uD7A3]/gu)?.join("") ?? "";
}

function countPrefixMatches(expected: string, spoken: string) {
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
) {
  if (spoken.length === 0) {
    return currentCount;
  }

  const fromBeginning = countPrefixMatches(expected, spoken);
  const fromCurrent =
    currentCount +
    countPrefixMatches(expected.slice(currentCount), spoken);

  return Math.min(Math.max(currentCount, fromBeginning, fromCurrent), expected.length);
}

function getTranscriptFromResults(event: BrowserSpeechRecognitionEvent) {
  let transcript = "";

  for (let index = 0; index < event.results.length; index += 1) {
    transcript += event.results[index]?.[0]?.transcript ?? "";
  }

  return transcript;
}

export function useHanjaVoiceRecognition({
  enabled,
  expectedText,
  onComplete
}: UseHanjaVoiceRecognitionOptions) {
  const expected = useMemo(
    () => normalizeKoreanSyllables(expectedText),
    [expectedText]
  );
  const [support, setSupport] = useState<SpeechSupport>("unknown");
  const [isListening, setIsListening] = useState(false);
  const [recognizedCount, setRecognizedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const recognizedCountRef = useRef(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const resetAttempt = useCallback(() => {
    recognizedCountRef.current = 0;
    completedRef.current = false;
    setRecognizedCount(0);
    setError(null);
  }, []);

  useEffect(() => {
    if (!enabled) {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      setIsListening(false);
      setSupport("unknown");
      resetAttempt();
      return;
    }

    setSupport(getSpeechRecognitionConstructor() ? "supported" : "unsupported");
  }, [enabled, resetAttempt]);

  useEffect(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
    resetAttempt();
  }, [expected, resetAttempt]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    if (!enabled || expected.length === 0) {
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setSupport("unsupported");
      return;
    }

    recognitionRef.current?.abort();
    resetAttempt();

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spoken = normalizeKoreanSyllables(getTranscriptFromResults(event));
      const nextCount = getNextRecognizedCount(
        expected,
        spoken,
        recognizedCountRef.current
      );

      if (nextCount > recognizedCountRef.current) {
        recognizedCountRef.current = nextCount;
        setRecognizedCount(nextCount);
      }

      if (nextCount >= expected.length && !completedRef.current) {
        completedRef.current = true;
        recognition.stop();
        recognitionRef.current = null;
        setIsListening(false);
        onCompleteRef.current();
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setSupport("supported");
      setIsListening(true);
      setError(null);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setError("start-failed");
    }
  }, [enabled, expected, resetAttempt]);

  return {
    error,
    isListening,
    recognizedCount,
    startListening,
    stopListening,
    support,
    targetCount: expected.length
  };
}
