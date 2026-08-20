# Hint Quality Audit

Generated from `dataset/master84.json`. This report is audit-only; it does not rewrite dataset hints.

## Summary

- Total records checked: 84
- Records with no suspicious hints by current heuristic: 10
- Total suspicious hints: 183

### Suspicious Count By Field

| Field | Count |
| --- | ---: |
| directMeaningHint | 48 |
| promptHanja | 57 |
| promptKorean | 57 |
| promptTranslation | 21 |

### Suspicious Count By Issue Label

| Issue Label | Count |
| --- | ---: |
| abrupt_cut | 83 |
| inconsistent_style | 43 |
| too_long | 33 |
| too_short | 24 |

## Top 10 Highest-Priority Fixes

| Page | ID | Quote No. | Field | Labels | Current Hint | Suggested Direction |
| ---: | --- | ---: | --- | --- | --- | --- |
| 83 | MGB-037 | 37 | promptTranslation | too_long, abrupt_cut | 배우기를 항상 다하지 못한 것처럼 하고 | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 34 | MGB-012 | 12 | promptHanja | too_long | 萬事從寬 | Shorten the cue unless this is intentionally a very short quote. |
| 34 | MGB-012 | 12 | promptKorean | too_long | 만사종관 | Shorten the cue unless this is intentionally a very short quote. |
| 46 | MGB-018 | 18 | promptHanja | too_long | 知足可樂 | Shorten the cue unless this is intentionally a very short quote. |
| 46 | MGB-018 | 18 | promptKorean | too_long | 지족가락 | Shorten the cue unless this is intentionally a very short quote. |
| 50 | MGB-019 | 19 | promptHanja | too_long | 滿招損 | Shorten the cue unless this is intentionally a very short quote. |
| 50 | MGB-019 | 19 | promptKorean | too_long | 만초손 | Shorten the cue unless this is intentionally a very short quote. |
| 57 | MGB-023 | 23 | promptHanja | too_long | 守口如甁 | Shorten the cue unless this is intentionally a very short quote. |
| 57 | MGB-023 | 23 | promptKorean | too_long | 수구여병 | Shorten the cue unless this is intentionally a very short quote. |
| 62 | MGB-025 | 25 | promptHanja | too_long | 心不負人 | Shorten the cue unless this is intentionally a very short quote. |

## Suspicious Hint Details

| Page | ID | Quote No. | Section | Field | Current Hint | Issue Label | Reason | Suggested Direction |
| ---: | --- | ---: | --- | --- | --- | --- | --- | --- |
| 8 | MGB-001 | 1 | 계선 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 12 | MGB-002 | 2 | 계선 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 13 | MGB-003 | 3 | 계선 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 13 | MGB-003 | 3 | 계선 편 | promptHanja | 一日不念 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 13 | MGB-003 | 3 | 계선 편 | promptKorean | 일일불념 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 14 | MGB-004 | 4 | 계선 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 18 | MGB-005 | 5 | 천명 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 18 | MGB-005 | 5 | 천명 편 | promptTranslation | 하늘에 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 22 | MGB-006 | 6 | 천명 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 22 | MGB-006 | 6 | 천명 편 | promptTranslation | 오이를 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 23 | MGB-007 | 7 | 효행 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 23 | MGB-007 | 7 | 효행 편 | promptTranslation | 아버님 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 24 | MGB-008 | 8 | 효행 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 28 | MGB-009 | 9 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 28 | MGB-009 | 9 | 정기 편 | promptTranslation | 남의 선한 것을 | abrupt_cut | promptTranslation appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 29 | MGB-010 | 10 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 29 | MGB-010 | 10 | 정기 편 | promptHanja | 勿以貴己 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 29 | MGB-010 | 10 | 정기 편 | promptKorean | 물이귀기 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 29 | MGB-010 | 10 | 정기 편 | promptTranslation | 자기를 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 30 | MGB-011 | 11 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 30 | MGB-011 | 11 | 정기 편 | promptTranslation | 나를 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 34 | MGB-012 | 12 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 34 | MGB-012 | 12 | 정기 편 | promptHanja | 萬事從寬 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 34 | MGB-012 | 12 | 정기 편 | promptKorean | 만사종관 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 35 | MGB-013 | 13 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 35 | MGB-013 | 13 | 정기 편 | promptHanja | 勤爲無價 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 35 | MGB-013 | 13 | 정기 편 | promptKorean | 근위무가 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 36 | MGB-014 | 14 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 36 | MGB-014 | 14 | 정기 편 | promptTranslation | 마음을 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 40 | MGB-015 | 15 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 40 | MGB-015 | 15 | 정기 편 | promptHanja | 瓜田不納 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 40 | MGB-015 | 15 | 정기 편 | promptKorean | 과전불납 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 44 | MGB-016 | 16 | 정기 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 44 | MGB-016 | 16 | 정기 편 | promptHanja | 耳不聞人 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 44 | MGB-016 | 16 | 정기 편 | promptKorean | 이불문인 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 44 | MGB-016 | 16 | 정기 편 | promptTranslation | 귀로는 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 45 | MGB-017 | 17 | 안분 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 46 | MGB-018 | 18 | 안분 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 46 | MGB-018 | 18 | 안분 편 | promptHanja | 知足可樂 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 46 | MGB-018 | 18 | 안분 편 | promptKorean | 지족가락 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 50 | MGB-019 | 19 | 안분 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 50 | MGB-019 | 19 | 안분 편 | promptHanja | 滿招損 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 50 | MGB-019 | 19 | 안분 편 | promptKorean | 만초손 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 54 | MGB-020 | 20 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 54 | MGB-020 | 20 | 존심 편 | promptHanja | 懼法朝朝 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 54 | MGB-020 | 20 | 존심 편 | promptKorean | 구법조조 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 55 | MGB-021 | 21 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 56 | MGB-022 | 22 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 56 | MGB-022 | 22 | 존심 편 | promptHanja | 薄施厚望 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 56 | MGB-022 | 22 | 존심 편 | promptKorean | 박시후망 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 57 | MGB-023 | 23 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 57 | MGB-023 | 23 | 존심 편 | promptHanja | 守口如甁 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 57 | MGB-023 | 23 | 존심 편 | promptKorean | 수구여병 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 57 | MGB-023 | 23 | 존심 편 | promptTranslation | 입을 지키는 것은 | abrupt_cut | promptTranslation appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 58 | MGB-024 | 24 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 58 | MGB-024 | 24 | 존심 편 | promptHanja | 施恩勿求 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 58 | MGB-024 | 24 | 존심 편 | promptKorean | 시은물구 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 62 | MGB-025 | 25 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 62 | MGB-025 | 25 | 존심 편 | promptHanja | 心不負人 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 62 | MGB-025 | 25 | 존심 편 | promptKorean | 심불부인 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 63 | MGB-026 | 26 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 63 | MGB-026 | 26 | 존심 편 | promptHanja | 心安茅屋 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 63 | MGB-026 | 26 | 존심 편 | promptKorean | 심안모옥 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 64 | MGB-027 | 27 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 64 | MGB-027 | 27 | 존심 편 | promptHanja | 責人者不 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 64 | MGB-027 | 27 | 존심 편 | promptKorean | 책인자부 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 68 | MGB-028 | 28 | 존심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 68 | MGB-028 | 28 | 존심 편 | promptHanja | 生事事生 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 68 | MGB-028 | 28 | 존심 편 | promptKorean | 생사사생 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 69 | MGB-029 | 29 | 계성 편 | directMeaningHint | 한때의 분한 것을 | abrupt_cut | directMeaningHint appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 69 | MGB-029 | 29 | 계성 편 | promptHanja | 忍一時之 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 69 | MGB-029 | 29 | 계성 편 | promptKorean | 인일시지 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 69 | MGB-029 | 29 | 계성 편 | promptTranslation | 한때의 분한 것을 참으면 | too_long | promptTranslation reveals 48% of the direct meaning. | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 70 | MGB-030 | 30 | 계성 편 | promptHanja | 屈己者能 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 70 | MGB-030 | 30 | 계성 편 | promptKorean | 굴기자능 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 74 | MGB-031 | 31 | 계성 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 75 | MGB-032 | 32 | 계성 편 | promptHanja | 凡事留人 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 75 | MGB-032 | 32 | 계성 편 | promptKorean | 범사유인 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 75 | MGB-032 | 32 | 계성 편 | promptTranslation | 모든 일에 인정을 남겨 두면 | too_long | promptTranslation reveals 42% of the direct meaning. | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 76 | MGB-033 | 33 | 근학 편 | promptHanja | 博學而篤 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 76 | MGB-033 | 33 | 근학 편 | promptKorean | 박학이독 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 76 | MGB-033 | 33 | 근학 편 | promptTranslation | 널리 배워 뜻을 돈독하게 하고 | abrupt_cut | promptTranslation appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 78 | MGB-035 | 35 | 근학 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 78 | MGB-035 | 35 | 근학 편 | promptHanja | 人生不學 | too_long | Hanja cue reveals 44% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 78 | MGB-035 | 35 | 근학 편 | promptKorean | 인생불학 | too_long | Korean reading cue reveals 44% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 82 | MGB-036 | 36 | 근학 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 83 | MGB-037 | 37 | 근학 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 83 | MGB-037 | 37 | 근학 편 | promptHanja | 學如不及 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 83 | MGB-037 | 37 | 근학 편 | promptKorean | 학여불급 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 83 | MGB-037 | 37 | 근학 편 | promptTranslation | 배우기를 항상 다하지 못한 것처럼 하고 | abrupt_cut | promptTranslation appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 83 | MGB-037 | 37 | 근학 편 | promptTranslation | 배우기를 항상 다하지 못한 것처럼 하고 | too_long | promptTranslation reveals 57% of the direct meaning. | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 84 | MGB-038 | 38 | 훈자 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 84 | MGB-038 | 38 | 훈자 편 | promptHanja | 憐兒多與 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 84 | MGB-038 | 38 | 훈자 편 | promptKorean | 련아다여 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 88 | MGB-039 | 39 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 88 | MGB-039 | 39 | 성심 편 | promptHanja | 明鏡 | too_short | Hanja cue is only 1-2 characters while the target phrase is substantially longer. | Use a more complete opening unit if the source phrase supports it. |
| 88 | MGB-039 | 39 | 성심 편 | promptKorean | 명경 | too_short | Korean reading cue is only 1-2 syllables while the target reading is substantially longer. | Use a more complete opening reading unit if the source phrase supports it. |
| 89 | MGB-040 | 40 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 89 | MGB-040 | 40 | 성심 편 | promptHanja | 天有不測 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 89 | MGB-040 | 40 | 성심 편 | promptKorean | 천유불측 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 90 | MGB-041 | 41 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 90 | MGB-041 | 41 | 성심 편 | promptHanja | 家和貧也 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 90 | MGB-041 | 41 | 성심 편 | promptKorean | 가화빈야 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 94 | MGB-042 | 42 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 95 | MGB-043 | 43 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 95 | MGB-043 | 43 | 성심 편 | promptHanja | 甚愛必甚 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 95 | MGB-043 | 43 | 성심 편 | promptKorean | 심애필심 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 96 | MGB-044 | 44 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 96 | MGB-044 | 44 | 성심 편 | promptHanja | 欲知未來 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 96 | MGB-044 | 44 | 성심 편 | promptKorean | 욕지미래 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 96 | MGB-044 | 44 | 성심 편 | promptTranslation | 미래를 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 100 | MGB-045 | 45 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 100 | MGB-045 | 45 | 성심 편 | promptHanja | 海枯終見 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 100 | MGB-045 | 45 | 성심 편 | promptKorean | 해고종견 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 100 | MGB-045 | 45 | 성심 편 | promptTranslation | 바다가 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 101 | MGB-046 | 46 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 101 | MGB-046 | 46 | 성심 편 | promptHanja | 若聽一面 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 101 | MGB-046 | 46 | 성심 편 | promptKorean | 약청일면 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 101 | MGB-046 | 46 | 성심 편 | promptTranslation | 만약 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 102 | MGB-047 | 47 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 102 | MGB-047 | 47 | 성심 편 | promptHanja | 巧者拙之 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 102 | MGB-047 | 47 | 성심 편 | promptKorean | 교자졸지 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 102 | MGB-047 | 47 | 성심 편 | promptTranslation | 재주가 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 103 | MGB-048 | 48 | 성심 편 | directMeaningHint | (missing) | inconsistent_style | directMeaningHint is missing while the record still has a directMeaning target. | Either rely deliberately on the other meaning cue field or add this field consistently. |
| 103 | MGB-048 | 48 | 성심 편 | promptHanja | 寧塞無底 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 103 | MGB-048 | 48 | 성심 편 | promptKorean | 영색무저 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 103 | MGB-048 | 48 | 성심 편 | promptTranslation | 차라리 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 108 | MGB-050 | 50 | 성심 | promptHanja | 一日清閑 | too_long | Hanja cue reveals 57% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 108 | MGB-050 | 50 | 성심 | promptKorean | 일일청한 | too_long | Korean reading cue reveals 57% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 109 | MGB-051 | 51 | 성심 | promptHanja | 無藥可醫 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 109 | MGB-051 | 51 | 성심 | promptKorean | 무약가의 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 111 | MGB-053 | 53 | 성심 | directMeaningHint | 사물을 대할 때 | abrupt_cut | directMeaningHint appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 112 | MGB-054 | 54 | 성심 | promptHanja | 水至清則 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 112 | MGB-054 | 54 | 성심 | promptKorean | 수지청즉 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 116 | MGB-055 | 55 | 성심 | promptHanja | 無故而得 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 116 | MGB-055 | 55 | 성심 | promptKorean | 무고이득 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 118 | MGB-057 | 57 | 성심 | promptHanja | 不恨自家 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 118 | MGB-057 | 57 | 성심 | promptKorean | 불한자가 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 122 | MGB-058 | 58 | 성심 | promptHanja | 尺璧非寶 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 122 | MGB-058 | 58 | 성심 | promptKorean | 척벽비보 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 122 | MGB-058 | 58 | 성심 | promptTranslation | 한 자나 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 123 | MGB-059 | 59 | 성심 | promptHanja | 入山擒虎 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 123 | MGB-059 | 59 | 성심 | promptKorean | 입산금호 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 124 | MGB-060 | 60 | 성심 | promptHanja | 遠水 | too_short | Hanja cue is only 1-2 characters while the target phrase is substantially longer. | Use a more complete opening unit if the source phrase supports it. |
| 124 | MGB-060 | 60 | 성심 | promptKorean | 원수 | too_short | Korean reading cue is only 1-2 syllables while the target reading is substantially longer. | Use a more complete opening reading unit if the source phrase supports it. |
| 128 | MGB-061 | 61 | 성심 | promptHanja | 器滿則溢 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 128 | MGB-061 | 61 | 성심 | promptKorean | 기만즉일 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 134 | MGB-064 | 64 | 입교 | promptHanja | 忠臣 | too_short | Hanja cue is only 1-2 characters while the target phrase is substantially longer. | Use a more complete opening unit if the source phrase supports it. |
| 134 | MGB-064 | 64 | 입교 | promptKorean | 충신 | too_short | Korean reading cue is only 1-2 syllables while the target reading is substantially longer. | Use a more complete opening reading unit if the source phrase supports it. |
| 135 | MGB-065 | 65 | 입교 | promptHanja | 讀書 | too_short | Hanja cue is only 1-2 characters while the target phrase is substantially longer. | Use a more complete opening unit if the source phrase supports it. |
| 135 | MGB-065 | 65 | 입교 | promptKorean | 독서 | too_short | Korean reading cue is only 1-2 syllables while the target reading is substantially longer. | Use a more complete opening reading unit if the source phrase supports it. |
| 136 | MGB-066 | 66 | 입교 | promptHanja | 治官 | too_short | Hanja cue is only 1-2 characters while the target phrase is substantially longer. | Use a more complete opening unit if the source phrase supports it. |
| 136 | MGB-066 | 66 | 입교 | promptKorean | 치관 | too_short | Korean reading cue is only 1-2 syllables while the target reading is substantially longer. | Use a more complete opening reading unit if the source phrase supports it. |
| 141 | MGB-068 | 68 | 치정 | directMeaningHint | 관직에 임해야 하는 | abrupt_cut | directMeaningHint appears to stop at an unnatural phrase boundary. | Stop at a natural semantic boundary. |
| 142 | MGB-069 | 69 | 안의 | promptHanja | 兄弟爲手 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 142 | MGB-069 | 69 | 안의 | promptKorean | 형제위수 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 146 | MGB-070 | 70 | 안의 | promptHanja | 富不親兮 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 146 | MGB-070 | 70 | 안의 | promptKorean | 부불친혜 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 148 | MGB-072 | 72 | 준예 | promptHanja | 君子有勇 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 148 | MGB-072 | 72 | 준예 | promptKorean | 군자유용 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 152 | MGB-073 | 73 | 준예 | promptHanja | 出門如見 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 152 | MGB-073 | 73 | 준예 | promptKorean | 출문여견 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 152 | MGB-073 | 73 | 준예 | promptTranslation | 문 밖에 | too_short | promptTranslation is very short relative to the direct meaning. | Use a slightly more meaningful opening phrase. |
| 153 | MGB-074 | 74 | 준예 | promptHanja | 若要人重 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 153 | MGB-074 | 74 | 준예 | promptKorean | 약요인중 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 154 | MGB-075 | 75 | 준예 | promptHanja | 父不言子 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 154 | MGB-075 | 75 | 준예 | promptKorean | 부불언자 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 158 | MGB-076 | 76 | 언어 | directMeaningHint | 이치에 맞지 않는 | too_long | directMeaningHint reveals 41% of the direct meaning. | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 158 | MGB-076 | 76 | 언어 | promptHanja | 言不中理 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 158 | MGB-076 | 76 | 언어 | promptKorean | 언부중리 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 159 | MGB-077 | 77 | 언어 | directMeaningHint | 한 마디 말이 맞지 않으면 | too_long | directMeaningHint reveals 53% of the direct meaning. | Shorten the cue so it behaves as a recall hint, not a partial answer. |
| 159 | MGB-077 | 77 | 언어 | promptHanja | 一言不中 | too_long | Hanja cue reveals 50% of the Hanja target. | Shorten the cue unless this is intentionally a very short quote. |
| 159 | MGB-077 | 77 | 언어 | promptKorean | 일언부중 | too_long | Korean reading cue reveals 50% of the reading target. | Shorten the cue unless this is intentionally a very short quote. |
| 164 | MGB-079 | 79 | 교우 | promptHanja | 相識滿天 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 164 | MGB-079 | 79 | 교우 | promptKorean | 상식만천 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 165 | MGB-080 | 80 | 교우 | promptHanja | 與好學人 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 165 | MGB-080 | 80 | 교우 | promptKorean | 여호학인 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 170 | MGB-082 | 82 | 교우 | promptHanja | 路遙知馬 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 170 | MGB-082 | 82 | 교우 | promptKorean | 로요지마 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 171 | MGB-083 | 83 | 권학 | promptHanja | 勿謂今日 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 171 | MGB-083 | 83 | 권학 | promptKorean | 물위금일 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |
| 172 | MGB-084 | 84 | 권학 | promptHanja | 盛年不重 | abrupt_cut | Hanja cue cuts inside the first source phrase token. | Prefer ending at a source phrase boundary or verify that a 4-character cue is intentional. |
| 172 | MGB-084 | 84 | 권학 | promptKorean | 성년부중 | abrupt_cut | Korean reading cue cuts inside the first reading token. | Prefer ending at a source phrase boundary or verify that a 4-syllable cue is intentional. |

## Records Reviewed

| Page | ID | Quote No. | Section | promptHanja | promptKorean | promptTranslation | directMeaningHint |
| ---: | --- | ---: | --- | --- | --- | --- | --- |
| 8 | MGB-001 | 1 | 계선 편 | 爲善者 | 위선자 | 선한 일을 | (missing) |
| 12 | MGB-002 | 2 | 계선 편 | 見善如渴 | 견선여갈 | 선한 일을 | (missing) |
| 13 | MGB-003 | 3 | 계선 편 | 一日不念 | 일일불념 | 하루라도 | (missing) |
| 14 | MGB-004 | 4 | 계선 편 | 恩義廣施 | 은의광시 | 은혜와 의리를 | (missing) |
| 18 | MGB-005 | 5 | 천명 편 | 順天者 | 순천자 | 하늘에 | (missing) |
| 22 | MGB-006 | 6 | 천명 편 | 種瓜得瓜 | 종과득과 | 오이를 | (missing) |
| 23 | MGB-007 | 7 | 효행 편 | 父兮生我 | 부혜생아 | 아버님 | (missing) |
| 24 | MGB-008 | 8 | 효행 편 | 孝於親 | 효어친 | 내가 부모에게 | (missing) |
| 28 | MGB-009 | 9 | 정기 편 | 見人之善 | 견인지선 | 남의 선한 것을 | (missing) |
| 29 | MGB-010 | 10 | 정기 편 | 勿以貴己 | 물이귀기 | 자기를 | (missing) |
| 30 | MGB-011 | 11 | 정기 편 | 道吾善者 | 도오선자 | 나를 | (missing) |
| 34 | MGB-012 | 12 | 정기 편 | 萬事從寬 | 만사종관 | 모든 일을 | (missing) |
| 35 | MGB-013 | 13 | 정기 편 | 勤爲無價 | 근위무가 | 부지런함은 | (missing) |
| 36 | MGB-014 | 14 | 정기 편 | 定心應物 | 정심응물 | 마음을 | (missing) |
| 40 | MGB-015 | 15 | 정기 편 | 瓜田不納 | 과전불납 | 남의 오이 | (missing) |
| 44 | MGB-016 | 16 | 정기 편 | 耳不聞人 | 이불문인 | 귀로는 | (missing) |
| 45 | MGB-017 | 17 | 안분 편 | 知足者 | 지족자 | 만족할 줄 | (missing) |
| 46 | MGB-018 | 18 | 안분 편 | 知足可樂 | 지족가락 | 만족할 줄 | (missing) |
| 50 | MGB-019 | 19 | 안분 편 | 滿招損 | 만초손 | 가득 차면 | (missing) |
| 54 | MGB-020 | 20 | 존심 편 | 懼法朝朝 | 구법조조 | 법을 두려워하면 | (missing) |
| 55 | MGB-021 | 21 | 존심 편 | 聰明思睿 | 총명사예 | 총명하고 | (missing) |
| 56 | MGB-022 | 22 | 존심 편 | 薄施厚望 | 박시후망 | 적게 베풀고 | (missing) |
| 57 | MGB-023 | 23 | 존심 편 | 守口如甁 | 수구여병 | 입을 지키는 것은 | (missing) |
| 58 | MGB-024 | 24 | 존심 편 | 施恩勿求 | 시은물구 | 은혜를 베풀되 | (missing) |
| 62 | MGB-025 | 25 | 존심 편 | 心不負人 | 심불부인 | 마음속으로 | (missing) |
| 63 | MGB-026 | 26 | 존심 편 | 心安茅屋 | 심안모옥 | 마음이 편안하면 | (missing) |
| 64 | MGB-027 | 27 | 존심 편 | 責人者不 | 책인자부 | 남을 꾸짖는 사람은 | (missing) |
| 68 | MGB-028 | 28 | 존심 편 | 生事事生 | 생사사생 | 일을 만들면 | (missing) |
| 69 | MGB-029 | 29 | 계성 편 | 忍一時之 | 인일시지 | 한때의 분한 것을 참으면 | 한때의 분한 것을 |
| 70 | MGB-030 | 30 | 계성 편 | 屈己者能 | 굴기자능 | 자기를 굽힐 줄 아는 사람은 | 자기를 굽힐 줄 |
| 74 | MGB-031 | 31 | 계성 편 | 得忍且忍 | 득인차인 | 참고 또 참아라 | (missing) |
| 75 | MGB-032 | 32 | 계성 편 | 凡事留人 | 범사유인 | 모든 일에 인정을 남겨 두면 | 모든 일에 인정을 |
| 76 | MGB-033 | 33 | 근학 편 | 博學而篤 | 박학이독 | 널리 배워 뜻을 돈독하게 하고 | 널리 배워 |
| 77 | MGB-034 | 34 | 근학 편 | 學而智遠 | 학이지원 | 사람이 배워서 아는 것이 많아지면 | 사람이 배워서 |
| 78 | MGB-035 | 35 | 근학 편 | 人生不學 | 인생불학 | 사람이 배우지 않으면 | (missing) |
| 82 | MGB-036 | 36 | 근학 편 | 玉不琢 | 옥불탁 | 옥은 다듬지 않으면 | (missing) |
| 83 | MGB-037 | 37 | 근학 편 | 學如不及 | 학여불급 | 배우기를 항상 다하지 못한 것처럼 하고 | (missing) |
| 84 | MGB-038 | 38 | 훈자 편 | 憐兒多與 | 련아다여 | 아이를 사랑하거든 | (missing) |
| 88 | MGB-039 | 39 | 성심 편 | 明鏡 | 명경 | 맑은 거울은 | (missing) |
| 89 | MGB-040 | 40 | 성심 편 | 天有不測 | 천유불측 | 하늘에는 | (missing) |
| 90 | MGB-041 | 41 | 성심 편 | 家和貧也 | 가화빈야 | 가정이 화목하면 | (missing) |
| 94 | MGB-042 | 42 | 성심 편 | 父不憂心 | 부불우심 | 아버지가 | (missing) |
| 95 | MGB-043 | 43 | 성심 편 | 甚愛必甚 | 심애필심 | 지나치게 | (missing) |
| 96 | MGB-044 | 44 | 성심 편 | 欲知未來 | 욕지미래 | 미래를 | (missing) |
| 100 | MGB-045 | 45 | 성심 편 | 海枯終見 | 해고종견 | 바다가 | (missing) |
| 101 | MGB-046 | 46 | 성심 편 | 若聽一面 | 약청일면 | 만약 | (missing) |
| 102 | MGB-047 | 47 | 성심 편 | 巧者拙之 | 교자졸지 | 재주가 | (missing) |
| 103 | MGB-048 | 48 | 성심 편 | 寧塞無底 | 영색무저 | 차라리 | (missing) |
| 104 | MGB-049 | 49 | 성심 | 成家之兒 | 성가지아 | 집안을 이룰 | 집안을 이룰 아이는 |
| 108 | MGB-050 | 50 | 성심 | 一日清閑 | 일일청한 | 하루라도 마음이 | 하루라도 마음이 |
| 109 | MGB-051 | 51 | 성심 | 無藥可醫 | 무약가의 | 약으로도 재상의 | 약으로도 |
| 110 | MGB-052 | 52 | 성심 | 欲知其君 | 욕지기군 | 그 임금을 | 그 임금을 알고자 하면 |
| 111 | MGB-053 | 53 | 성심 | 接物之要 | 접물지요 | 사물을 대할 | 사물을 대할 때 |
| 112 | MGB-054 | 54 | 성심 | 水至清則 | 수지청즉 | 물이 너무 | 물이 너무 맑으면 |
| 116 | MGB-055 | 55 | 성심 | 無故而得 | 무고이득 | 아무 까닭 | 아무 까닭 없이 |
| 117 | MGB-056 | 56 | 성심 | 大廈千間 | 대하천간 | 천 칸이나 | 천 칸이나 되는 |
| 118 | MGB-057 | 57 | 성심 | 不恨自家 | 불한자가 | 자기 두레박줄이 | 자기 두레박줄이 |
| 122 | MGB-058 | 58 | 성심 | 尺璧非寶 | 척벽비보 | 한 자나 | 한 자나 되는 옥이 |
| 123 | MGB-059 | 59 | 성심 | 入山擒虎 | 입산금호 | 산에 들어가 | 산에 들어가 |
| 124 | MGB-060 | 60 | 성심 | 遠水 | 원수 | 멀리 있는 | 멀리 있는 물은 |
| 128 | MGB-061 | 61 | 성심 | 器滿則溢 | 기만즉일 | 그릇이 가득 | 그릇이 가득 차면 |
| 129 | MGB-062 | 62 | 성심 | 良田萬頃 | 양전만경 | 기름진 땅 | 기름진 땅 |
| 130 | MGB-063 | 63 | 입교 | 一生之計 | 일생지계 | 일생의 계획은 | 일생의 계획은 |
| 134 | MGB-064 | 64 | 입교 | 忠臣 | 충신 | 충신은 두 | 충신은 두 임금을 |
| 135 | MGB-065 | 65 | 입교 | 讀書 | 독서 | 독서는 집안을 | 독서는 집안을 |
| 136 | MGB-066 | 66 | 입교 | 治官 | 치관 | 관리가 일을 | 관리가 일을 |
| 140 | MGB-067 | 67 | 치정 | 一命之士 | 일명지사 | 처음 벼슬하는 | 처음 벼슬하는 |
| 141 | MGB-068 | 68 | 치정 | 當官之法 | 당관지법 | 관직에 임해야 | 관직에 임해야 하는 |
| 142 | MGB-069 | 69 | 안의 | 兄弟爲手 | 형제위수 | 형제는 손발과 | 형제는 손발과 같고 |
| 146 | MGB-070 | 70 | 안의 | 富不親兮 | 부불친혜 | 부유하다고 친하지 | 부유하다고 친하지 않고 |
| 147 | MGB-071 | 71 | 준예 | 老少長幼 | 노소장유 | 노인과 젊은이, | 노인과 젊은이, |
| 148 | MGB-072 | 72 | 준예 | 君子有勇 | 군자유용 | 군자가 용맹이 | 군자가 용맹이 있고 |
| 152 | MGB-073 | 73 | 준예 | 出門如見 | 출문여견 | 문 밖에 | 문 밖에 나가서는 |
| 153 | MGB-074 | 74 | 준예 | 若要人重 | 약요인중 | 만약 남이 | 만약 남이 나를 |
| 154 | MGB-075 | 75 | 준예 | 父不言子 | 부불언자 | 아버지는 자식의 | 아버지는 자식의 덕을 |
| 158 | MGB-076 | 76 | 언어 | 言不中理 | 언부중리 | 이치에 맞지 | 이치에 맞지 않는 |
| 159 | MGB-077 | 77 | 언어 | 一言不中 | 일언부중 | 한 마디 | 한 마디 말이 맞지 않으면 |
| 160 | MGB-078 | 78 | 언어 | 口舌者 | 구설자 | 입과 혀는 | 입과 혀는 |
| 164 | MGB-079 | 79 | 교우 | 相識滿天 | 상식만천 | 서로 얼굴을 | 서로 얼굴을 아는 |
| 165 | MGB-080 | 80 | 교우 | 與好學人 | 여호학인 | 배우기를 좋아하는 | 배우기를 좋아하는 |
| 166 | MGB-081 | 81 | 교우 | 不結子花 | 불결자화 | 열매를 맺지 | 열매를 맺지 않는 |
| 170 | MGB-082 | 82 | 교우 | 路遙知馬 | 로요지마 | 길이 멀면 | 길이 멀면 |
| 171 | MGB-083 | 83 | 권학 | 勿謂今日 | 물위금일 | 오늘 배우지 | 오늘 배우지 않고 |
| 172 | MGB-084 | 84 | 권학 | 盛年不重 | 성년부중 | 젊은 나이는 | 젊은 나이는 |
