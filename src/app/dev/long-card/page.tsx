import { StudyCard } from "@/components/study-card";
import { longCardFixture } from "@dataset/fixtures/long-card";

export default function DevLongCardPage() {
  return (
    <main className="flex h-dvh w-full overflow-hidden bg-black px-4 py-4">
      <div className="mx-auto flex h-full w-full max-w-md">
        <StudyCard passages={[longCardFixture]} />
      </div>
    </main>
  );
}
