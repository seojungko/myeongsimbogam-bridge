import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const datasetPath = join(__dirname, "..", "dataset", "master84.json");
const dataset = JSON.parse(readFileSync(datasetPath, "utf8"));

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function countVisibleCharacters(value) {
  return Array.from(value).filter((character) => !/\s/.test(character)).length;
}

function getRecordLabel(record, index) {
  return isObject(record) && typeof record.id === "string"
    ? record.id
    : `index ${index}`;
}

function validateRecord(record, index) {
  const label = getRecordLabel(record, index);
  const errors = [];

  if (!isObject(record)) {
    return [`${label}: record must be an object`];
  }

  if (!isNonEmptyString(record.id)) {
    errors.push(`${label}: id must be a non-empty string`);
  }

  if (typeof record.page !== "number") {
    errors.push(`${label}: page must be a number`);
  }

  if (record.title !== undefined && !isNonEmptyString(record.title)) {
    errors.push(`${label}: title must be a non-empty string when provided`);
  }

  if (record.section !== undefined && typeof record.section !== "string") {
    errors.push(`${label}: section must be a string when provided`);
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

  if (!isNonEmptyString(record.directMeaning)) {
    errors.push(`${label}: directMeaning must not be empty`);
  }

  if (
    isNonEmptyString(record.promptHanja) &&
    isNonEmptyString(record.fullHanja) &&
    !record.fullHanja.includes(record.promptHanja)
  ) {
    errors.push(`${label}: promptHanja must appear inside fullHanja`);
  }

  if (
    isNonEmptyString(record.promptKorean) &&
    isNonEmptyString(record.fullKorean) &&
    !record.fullKorean.includes(record.promptKorean)
  ) {
    errors.push(`${label}: promptKorean must appear inside fullKorean`);
  }

  if (
    isNonEmptyString(record.promptTranslation) &&
    isNonEmptyString(record.translation) &&
    !record.translation.includes(record.promptTranslation)
  ) {
    errors.push(`${label}: promptTranslation must appear inside translation`);
  }

  if (
    isNonEmptyString(record.translation) &&
    isNonEmptyString(record.directMeaning) &&
    record.translation !== record.directMeaning
  ) {
    errors.push(`${label}: translation must equal directMeaning`);
  }

  if (isNonEmptyString(record.fullHanja) && isNonEmptyString(record.fullKorean)) {
    const hanjaLines = record.fullHanja.split("\n");
    const koreanLines = record.fullKorean.split("\n");

    if (hanjaLines.length !== koreanLines.length) {
      errors.push(`${label}: fullHanja and fullKorean line counts must match`);
    }

    hanjaLines.forEach((hanjaLine, lineIndex) => {
      const koreanLine = koreanLines[lineIndex] ?? "";
      const hanjaCount = countVisibleCharacters(hanjaLine);
      const koreanCount = countVisibleCharacters(koreanLine);

      if (hanjaCount !== koreanCount) {
        errors.push(
          `${label}: line ${lineIndex + 1} Hanja count (${hanjaCount}) must match Korean count (${koreanCount})`
        );
      }
    });
  }

  if (!Array.isArray(record.characters)) {
    errors.push(`${label}: characters must be an array`);
  } else {
    const knownCharacters = new Set();

    record.characters.forEach((character, characterIndex) => {
      if (
        !isObject(character) ||
        !isNonEmptyString(character.character) ||
        !isNonEmptyString(character.meaning) ||
        !isNonEmptyString(character.sound)
      ) {
        errors.push(
          `${label}: characters[${characterIndex}] must have character, meaning, sound`
        );
      } else {
        knownCharacters.add(character.character);
      }
    });

    if (isNonEmptyString(record.fullHanja)) {
      Array.from(record.fullHanja)
        .filter((character) => !/\s/.test(character))
        .forEach((character) => {
          if (!knownCharacters.has(character)) {
            errors.push(`${label}: character ${character} is missing from characters`);
          }
        });
    }
  }

  return errors;
}

function validateDataset(value) {
  const duplicateIds = [];
  const duplicatePages = [];
  const invalidRecords = [];
  const pages = [];
  const seenIds = new Set();
  const seenPages = new Set();

  if (!isObject(value)) {
    return {
      duplicateIds,
      duplicatePages,
      invalidRecords: ["dataset must be an object"],
      pages,
      totalRecords: 0
    };
  }

  if (!Array.isArray(value.records)) {
    return {
      duplicateIds,
      duplicatePages,
      invalidRecords: ["records must be an array"],
      pages,
      totalRecords: 0
    };
  }

  value.records.forEach((record, index) => {
    invalidRecords.push(...validateRecord(record, index));

    if (!isObject(record)) {
      return;
    }

    if (typeof record.id === "string") {
      if (seenIds.has(record.id)) {
        duplicateIds.push(record.id);
      }

      seenIds.add(record.id);
    }

    if (typeof record.page === "number") {
      if (seenPages.has(record.page)) {
        duplicatePages.push(record.page);
      }

      seenPages.add(record.page);
      pages.push(record.page);
    }
  });

  return {
    duplicateIds,
    duplicatePages,
    invalidRecords,
    pages,
    totalRecords: value.records.length
  };
}

const result = validateDataset(dataset);

console.log(`Total records: ${result.totalRecords}`);
console.log(`Duplicate ids: ${result.duplicateIds.join(", ") || "none"}`);
console.log(`Duplicate pages: ${result.duplicatePages.join(", ") || "none"}`);
console.log(`Invalid records: ${result.invalidRecords.length}`);

for (const issue of result.invalidRecords) {
  console.log(`- ${issue}`);
}

console.log(`Pages included: ${result.pages.join(", ") || "none"}`);

if (
  result.duplicateIds.length > 0 ||
  result.duplicatePages.length > 0 ||
  result.invalidRecords.length > 0
) {
  process.exitCode = 1;
}
