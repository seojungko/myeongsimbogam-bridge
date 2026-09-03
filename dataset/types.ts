export type DatasetSlug = "master84";

export type DatasetLocale = "ko-KR";

export type StudyPageRecord = {
  id: string;
  quoteNo?: number;
  page: number;
  title?: string;
  source?: string;
  section?: string;
  promptHanja: string;
  promptKorean: string;
  promptTranslation: string;
  fullHanja: string;
  fullKorean: string;
  directMeaning: string;
  directMeaningHint?: string;
  directMeaningLines?: string[];
  translation: string;
  deepMeaning?: string;
  hanjaLines?: string[];
  koreanLines?: string[];
  characters: CharacterMeaning[];
  sourceFile?: string;
  reviewStatus?: string;
  reviewNote?: string;
  learningSets?: LearningSet[];
  tags?: string[];
};

export type CharacterMeaning = {
  character: string;
  meaning: string;
  sound: string;
};

export type LearningMeaningLink = {
  character: string;
  target: string;
};

export type LearningChunk = {
  hanja: string;
  reading: string;
  directMeaning: string;
  meaningLinks?: LearningMeaningLink[];
};

export type LearningSet = {
  chunks: LearningChunk[];
};

export type Master84Dataset = {
  schemaVersion: 1;
  slug: DatasetSlug;
  title: string;
  locale: DatasetLocale;
  sourceSchemaVersion?: string;
  sourceCreatedAt?: string;
  sourceRecordCount?: number;
  sourcePages?: number[];
  notes?: string[];
  verificationSummary?: {
    pageUniquePass?: boolean;
    lineHanjaKoreanCountPass?: boolean;
    characterCoveragePass?: boolean;
    directMeaningPresentPass?: boolean;
    errorCount?: number;
    warningCount?: number;
  };
  records: StudyPageRecord[];
};

export type StudyDataset = Master84Dataset;
