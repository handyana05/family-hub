// components/widget-icon.tsx
import type { LucideIcon } from "lucide-react";

type WidgetIconProps = {
  icon: LucideIcon;
  tone?: "violet" | "green" | "blue" | "amber" | "purple";
};

const toneClasses = {
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300",
  green:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300",
  blue:
    "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300",
  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300",
  purple:
    "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300",
};

export function WidgetIcon({
  icon: Icon,
  tone = "violet",
}: WidgetIconProps) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
    >
      <Icon className="h-6 w-6" strokeWidth={2} />
    </div>
  );
}