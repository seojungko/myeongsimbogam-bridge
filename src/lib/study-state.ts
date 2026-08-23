import type { StudyPageRecord } from "@dataset/types";

export const STUDY_STATE_KEY = "bridge.studyState.v1";
export const LEGACY_LEARNED_RECORD_IDS_KEY = "bridge.learnedRecordIds";

export type StudyStateV1 = {
  version: 1;
  learnedQuoteIds: string[];
  currentQuoteId: string;
  selectedRangeStart: number;
  selectedRangeEnd: number;
};

type StudyStateSnapshot = {
  currentIndex: number;
  learnedQuoteIds: Set<string>;
  selectedRangeEnd: number;
  selectedRangeStart: number;
};

function getRangeEnd(page: number) {
  return Math.ceil(page / 20) * 20;
}

function getRangeStart(rangeEnd: number) {
  return rangeEnd - 19;
}

function isValidRange(start: unknown, end: unknown) {
  return (
    typeof start === "number" &&
    Number.isInteger(start) &&
    typeof end === "number" &&
    Number.isInteger(end) &&
    start >= 1 &&
    end === start + 19 &&
    end % 20 === 0
  );
}

function readLegacyLearnedIds(storage: Storage, validIds: Set<string>) {
  try {
    const rawValue = storage.getItem(LEGACY_LEARNED_RECORD_IDS_KEY);
    const value: unknown = rawValue ? JSON.parse(rawValue) : [];

    return Array.isArray(value)
      ? value.filter(
          (recordId): recordId is string =>
            typeof recordId === "string" && validIds.has(recordId)
        )
      : [];
  } catch {
    return [];
  }
}

function getDefaultSnapshot(
  passages: readonly StudyPageRecord[]
): StudyStateSnapshot {
  const firstPassage = passages[0];
  const selectedRangeEnd = firstPassage ? getRangeEnd(firstPassage.page) : 20;

  return {
    currentIndex: 0,
    learnedQuoteIds: new Set<string>(),
    selectedRangeEnd,
    selectedRangeStart: getRangeStart(selectedRangeEnd)
  };
}

export function readStudyState(
  passages: readonly StudyPageRecord[],
  storage: Storage
): StudyStateSnapshot {
  const fallback = getDefaultSnapshot(passages);
  const validIds = new Set(passages.map((passage) => passage.id));

  try {
    const rawValue = storage.getItem(STUDY_STATE_KEY);
    const value: unknown = rawValue ? JSON.parse(rawValue) : null;

    if (
      !value ||
      typeof value !== "object" ||
      !("version" in value) ||
      value.version !== 1
    ) {
      throw new Error("Unsupported study-state version");
    }

    const stored = value as Partial<StudyStateV1>;
    const learnedQuoteIds = new Set(
      Array.isArray(stored.learnedQuoteIds)
        ? stored.learnedQuoteIds.filter(
            (recordId): recordId is string =>
              typeof recordId === "string" && validIds.has(recordId)
          )
        : []
    );
    const hasValidRange = isValidRange(
      stored.selectedRangeStart,
      stored.selectedRangeEnd
    );
    const selectedRangeStart = hasValidRange
      ? stored.selectedRangeStart!
      : fallback.selectedRangeStart;
    const selectedRangeEnd = hasValidRange
      ? stored.selectedRangeEnd!
      : fallback.selectedRangeEnd;
    const storedIndex = passages.findIndex(
      (passage) => passage.id === stored.currentQuoteId
    );
    const fallbackRangeIndex = passages.findIndex(
      (passage) =>
        passage.page >= selectedRangeStart && passage.page <= selectedRangeEnd
    );

    return {
      currentIndex:
        storedIndex >= 0
          ? storedIndex
          : fallbackRangeIndex >= 0
            ? fallbackRangeIndex
            : 0,
      learnedQuoteIds,
      selectedRangeEnd,
      selectedRangeStart
    };
  } catch {
    const legacyLearnedIds = readLegacyLearnedIds(storage, validIds);

    return {
      ...fallback,
      learnedQuoteIds: new Set(legacyLearnedIds)
    };
  }
}

export function writeStudyState(storage: Storage, state: StudyStateV1) {
  storage.setItem(STUDY_STATE_KEY, JSON.stringify(state));
}

export function clearStudyState(storage: Storage) {
  storage.removeItem(STUDY_STATE_KEY);
}
