import master84Json from "./master84.json";
import type {
  CharacterMeaning,
  Master84Dataset,
  StudyDataset,
  StudyPageRecord
} from "./types";

function isCharacterMeaning(value: unknown): value is CharacterMeaning {
  if (!value || typeof value !== "object") {
    return false;
  }

  const character = value as Record<string, unknown>;

  return (
    typeof character.character === "string" &&
    typeof character.meaning === "string" &&
    typeof character.sound === "string"
  );
}

function isRecord(value: unknown): value is StudyPageRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.page === "number" &&
    typeof record.title === "string" &&
    typeof record.source === "string" &&
    typeof record.promptHanja === "string" &&
    typeof record.promptKorean === "string" &&
    typeof record.fullHanja === "string" &&
    typeof record.fullKorean === "string" &&
    (record.promptTranslation === undefined ||
      typeof record.promptTranslation === "string") &&
    (record.fullTranslation === undefined ||
      typeof record.fullTranslation === "string") &&
    typeof record.translation === "string" &&
    Array.isArray(record.characters) &&
    record.characters.every(isCharacterMeaning) &&
    Array.isArray(record.tags) &&
    record.tags.every((tag) => typeof tag === "string")
  );
}

function assertMaster84Dataset(
  value: unknown
): asserts value is Master84Dataset {
  if (!value || typeof value !== "object") {
    throw new Error("master84 dataset must be an object.");
  }

  const dataset = value as Record<string, unknown>;

  if (
    dataset.schemaVersion !== 1 ||
    dataset.slug !== "master84" ||
    dataset.locale !== "ko-KR" ||
    typeof dataset.title !== "string" ||
    !Array.isArray(dataset.records) ||
    !dataset.records.every(isRecord)
  ) {
    throw new Error("master84 dataset has an invalid shape.");
  }

  const pages = new Set<number>();

  for (const record of dataset.records) {
    if (pages.has(record.page)) {
      throw new Error(`Duplicate page in master84 dataset: ${record.page}`);
    }

    if (!record.fullHanja.startsWith(record.promptHanja)) {
      throw new Error(`fullHanja must start with promptHanja: ${record.id}`);
    }

    if (!record.fullKorean.startsWith(record.promptKorean)) {
      throw new Error(`fullKorean must start with promptKorean: ${record.id}`);
    }

    if (
      record.promptTranslation &&
      !(record.fullTranslation ?? record.translation).includes(
        record.promptTranslation
      )
    ) {
      throw new Error(
        `translation must include promptTranslation: ${record.id}`
      );
    }

    pages.add(record.page);
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

export function loadStudyPages(
  slug: "master84" = "master84"
): readonly StudyPageRecord[] {
  return loadStudyDataset(slug).records;
}
