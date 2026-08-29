import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type WallCardTone =
  | "violet"
  | "green"
  | "blue"
  | "amber"
  | "purple"
  | "red";

export type WallCardVariant =
  | "default"
  | "note";

type WallCardProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;

  icon?: LucideIcon;
  iconTone?: WallCardTone;
  variant?: WallCardVariant;
};

const iconToneClasses: Record<WallCardTone, string> = {
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
  green:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  blue:
    "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  amber:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  purple:
    "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300",
  red:
    "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

const variantClasses: Record<WallCardVariant, string> = {
  default:
    "bg-slate-100 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10",
  note:
    "bg-amber-300 text-slate-950",
};

export function WallCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
  icon: Icon,
  iconTone = "violet",
  variant = "default",
}: WallCardProps) {
  const isNote = variant === "note";

  return (
    <section
      className={`overflow-hidden rounded-3xl p-6 ${variantClasses[variant]} ${className}`}
    >
      {(title || subtitle || actions || Icon) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            {Icon ? (
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  isNote
                    ? "bg-amber-100 text-amber-700"
                    : iconToneClasses[iconTone]
                }`}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={2}
                />
              </div>
            ) : null}

            <div className="min-w-0">
              {title ? (
                <h2
                  className={`text-3xl font-semibold ${
                    isNote
                      ? "text-slate-950"
                      : "text-slate-950 dark:text-white"
                  }`}
                >
                  {title}
                </h2>
              ) : null}

              {subtitle ? (
                <p
                  className={`mt-1 text-sm ${
                    isNote
                      ? "text-slate-700"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {actions ? (
            <div className="shrink-0">
              {actions}
            </div>
          ) : null}
        </div>
      )}

      {children}
    </section>
  );
}