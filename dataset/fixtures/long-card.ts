import type { StudyPageRecord } from "../types";

// layout stress-test fixture, not final content
const longCardFixtureBase = {
  id: "layout-stress-long-card",
  page: 999,
  title: "Layout stress-test fixture, not final content",
  source: "layout stress-test fixture, not final content",
  promptHanja: "積善之家",
  promptKorean: "적선지가",
  promptTranslation: "선을 쌓은",
  fullHanja:
    "積善之家 必有餘慶 仁義禮智 常存於心\n見善如不及 見不善如探湯 日用之間 戒愼恐懼\n一日三省其身 言行相顧 忠信篤敬 終身不忘",
  fullKorean:
    "적선지가 필유여경 인의예지 상존어심\n견선여불급 견불선여탐탕 일용지간 계신공구\n일일삼성기신 언행상고 충신독경 종신불망",
  translation:
    "선을 쌓은 집안에는 반드시 남는 경사가 있고, 어질고 의로운 마음과 예절과 지혜를 늘 마음속에 간직해야 한다. 좋은 일을 보면 미치지 못할까 힘쓰고, 좋지 않은 일을 보면 뜨거운 물을 만지듯 조심하며, 날마다 쓰는 말과 행동 사이에서도 삼가고 두려워하는 마음을 잃지 않는다. 하루에 여러 번 자신을 돌아보고 말과 행동이 서로 어긋나지 않도록 살피며, 충성되고 믿음직하며 두텁고 공경스러운 마음을 평생 잊지 않는다는 뜻이다.",
  characters: [
    { character: "積", meaning: "쌓을", sound: "적" },
    { character: "善", meaning: "착할", sound: "선" },
    { character: "家", meaning: "집", sound: "가" },
    { character: "必", meaning: "반드시", sound: "필" },
    { character: "有", meaning: "있을", sound: "유" },
    { character: "餘", meaning: "남을", sound: "여" },
    { character: "慶", meaning: "경사", sound: "경" },
    { character: "仁", meaning: "어질", sound: "인" },
    { character: "義", meaning: "옳을", sound: "의" },
    { character: "禮", meaning: "예도", sound: "례" },
    { character: "智", meaning: "지혜", sound: "지" },
    { character: "心", meaning: "마음", sound: "심" }
  ],
  tags: ["layout-test", "not-final-content"]
};

export const longCardFixture: StudyPageRecord = {
  ...longCardFixtureBase,
  directMeaning: longCardFixtureBase.translation
};
