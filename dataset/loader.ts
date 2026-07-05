import master84Json from "./master84.json";
import type {
  CharacterMeaning,
  Master84Dataset,
  StudyDataset,
  StudyPageRecord
} from "./types";

export type DatasetValidationResult = {
  duplicateIds: string[];
  invalidRecords: string[];
  pages: number[];
  totalRecords: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCharacterMeaning(value: unknown): value is CharacterMeaning {
  if (!isObject(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.character) &&
    isNonEmptyString(value.meaning) &&
    isNonEmptyString(value.sound)
  );
}

function getRecordErrors(value: unknown, index: number) {
  const label = isObject(value) && typeof value.id === "string" ? value.id : `index ${index}`;
  const errors: string[] = [];

  if (!isObject(value)) {
    return [`${label}: record must be an object`];
  }

  const record = value;

  if (!isNonEmptyString(record.id)) {
    errors.push(`${label}: id must be a non-empty string`);
  }

  if (typeof record.page !== "number") {
    errors.push(`${label}: page must be a number`);
  }

  if (!isNonEmptyString(record.title)) {
    errors.push(`${label}: title must be a non-empty string`);
  }

  if (record.source !== undefined && typeof record.source !== "string") {
    errors.push(`${label}: source must be a string when provided`);
  }

  if (!isNonEmptyString(record.promptHanja)) {
    errors.push(`${label}: promptHanja must be a non-empty string`);
  }

  if (!isNonEmptyString(record.promptKorean)) {
    errors.push(`${label}: promptKorean must be a non-empty string`);
  }

  if (!isNonEmptyString(record.promptTranslation)) {
    errors.push(`${label}: promptTranslation must be a non-empty string`);
  }

  if (!isNonEmptyString(record.fullHanja)) {
    errors.push(`${label}: fullHanja must not be empty`);
  }

  if (!isNonEmptyString(record.fullKorean)) {
    errors.push(`${label}: fullKorean must not be empty`);
  }

  if (!isNonEmptyString(record.translation)) {
    errors.push(`${label}: translation must not be empty`);
  }

  const promptHanja = isNonEmptyString(record.promptHanja)
    ? record.promptHanja
    : null;
  const promptKorean = isNonEmptyString(record.promptKorean)
    ? record.promptKorean
    : null;
  const promptTranslation = isNonEmptyString(record.promptTranslation)
    ? record.promptTranslation
    : null;
  const fullHanja = isNonEmptyString(record.fullHanja)
    ? record.fullHanja
    : null;
  const fullKorean = isNonEmptyString(record.fullKorean)
    ? record.fullKorean
    : null;
  const translation = isNonEmptyString(record.translation)
    ? record.translation
    : null;

  if (promptHanja && fullHanja && !fullHanja.includes(promptHanja)) {
    errors.push(`${label}: promptHanja must appear inside fullHanja`);
  }

  if (promptKorean && fullKorean && !fullKorean.includes(promptKorean)) {
    errors.push(`${label}: promptKorean must appear inside fullKorean`);
  }

  if (
    promptTranslation &&
    translation &&
    !translation.includes(promptTranslation)
  ) {
    errors.push(`${label}: promptTranslation must appear inside translation`);
  }

  if (!Array.isArray(record.characters)) {
    errors.push(`${label}: characters must be an array`);
  } else {
    record.characters.forEach((character, characterIndex) => {
      if (!isCharacterMeaning(character)) {
        errors.push(
          `${label}: characters[${characterIndex}] must have character, meaning, sound`
        );
      }
    });
  }

  if (record.tags !== undefined) {
    if (
      !Array.isArray(record.tags) ||
      !record.tags.every((tag) => typeof tag === "string")
    ) {
      errors.push(`${label}: tags must be a string array when provided`);
    }
  }

  return errors;
}

export function validateMaster84Dataset(value: unknown): DatasetValidationResult {
  const invalidRecords: string[] = [];
  const duplicateIds: string[] = [];
  const pages: number[] = [];

  if (!isObject(value)) {
    return {
      duplicateIds,
      invalidRecords: ["dataset must be an object"],
      pages,
      totalRecords: 0
    };
  }

  if (
    value.schemaVersion !== 1 ||
    value.slug !== "master84" ||
    value.locale !== "ko-KR" ||
    !isNonEmptyString(value.title)
  ) {
    invalidRecords.push("dataset metadata is invalid");
  }

  if (!Array.isArray(value.records)) {
    return {
      duplicateIds,
      invalidRecords: [...invalidRecords, "records must be an array"],
      pages,
      totalRecords: 0
    };
  }

  const seenIds = new Set<string>();

  value.records.forEach((record, index) => {
    invalidRecords.push(...getRecordErrors(record, index));

    if (isObject(record)) {
      if (typeof record.id === "string") {
        if (seenIds.has(record.id)) {
          duplicateIds.push(record.id);
        }

        seenIds.add(record.id);
      }

      if (typeof record.page === "number") {
        pages.push(record.page);
      }
    }
  });

  return {
    duplicateIds,
    invalidRecords,
    pages,
    totalRecords: value.records.length
  };
}

function assertMaster84Dataset(value: unknown): asserts value is Master84Dataset {
  const result = validateMaster84Dataset(value);

  if (result.duplicateIds.length > 0 || result.invalidRecords.length > 0) {
    throw new Error(
      [
        "master84 dataset has an invalid shape.",
        ...result.duplicateIds.map((id) => `Duplicate id: ${id}`),
        ...result.invalidRecords
      ].join("\n")
    );
  }
}

const master84Dataset: unknown = master84Json;
assertMaster84Dataset(master84Dataset);
const typedMaster84Dataset: Master84Dataset = master84Dataset;

export function loadMaster84Dataset(): Master84Dataset {
  return typedMaster84Dataset;
}

export function loadStudyDataset(slug: "master84" = "master84"): StudyDataset {
  if (slug === "master84") {
    return loadMaster84Dataset();
  }

  throw new Error(`Unsupported study dataset: ${slug}`);
}

export function loadStudyPages(slug: "master84" = "master84"): StudyPageRecord[] {
  return loadStudyDataset(slug).records;
}
