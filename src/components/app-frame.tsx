import type { ReactNode } from "react";
import { Home, Library, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

type AppFrameProps = {
  children: ReactNode;
};

const navItems = [
  { label: "홈", icon: Home, active: true },
  { label: "자료", icon: Library, active: false },
  { label: "설정", icon: Settings, active: false }
];

export function AppFrame({ children }: AppFrameProps) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-4">
      {children}
      <nav className="bg-black/88 fixed inset-x-0 bottom-0 z-20 border-t border-white/10 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex h-12 items-center justify-center rounded-md text-sm transition",
                item.active
                  ? "accent-ring bg-surface-card text-white"
                  : "hover:bg-white/6 text-white/50 hover:text-white"
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="size-5" aria-hidden />
              <span className="sr-only">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
