import { MoveHorizontal } from "lucide-react";

type WallSwipeHintProps = {
  className?: string;
};

export function WallSwipeHint({ className = "" }: WallSwipeHintProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-400 dark:ring-white/10 ${className}`}
      aria-label="Swipe left or right to navigate"
      title="Swipe left or right to navigate"
    >
      <MoveHorizontal className="h-4 w-4" />
      <span>Swipe left or right to navigate</span>
    </div>
  );
}