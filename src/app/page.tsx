import { StudyCard } from "@/components/study-card";
import { loadStudyPages } from "@dataset/loader";

const passages = loadStudyPages();

export default function HomePage() {
  return (
    <main className="flex h-dvh w-full overflow-hidden bg-black px-4 py-4">
      <div className="mx-auto flex h-full w-full max-w-md">
        <StudyCard passages={passages} />
      </div>
    </main>
  );
}
