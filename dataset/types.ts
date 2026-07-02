export type DatasetSlug = "master84";

export type DatasetLocale = "ko-KR";

export type StudyPageRecord = {
  id: string;
  page: number;
  title: string;
  source: string;
  promptHanja: string;
  promptKorean: string;
  fullHanja: string;
  fullKorean: string;
  promptTranslation?: string;
  fullTranslation?: string;
  translation: string;
  characters: readonly CharacterMeaning[];
  tags: readonly string[];
};

export type CharacterMeaning = {
  character: string;
  meaning: string;
  sound: string;
};

export type Master84Dataset = {
  schemaVersion: 1;
  slug: DatasetSlug;
  title: string;
  locale: DatasetLocale;
  records: readonly StudyPageRecord[];
};

export type StudyDataset = Master84Dataset;
