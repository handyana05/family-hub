import { LucideIcon } from "lucide-react";

type SectionCardProps = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  iconTone?: "violet" | "green" | "blue" | "amber" | "purple" | "red";
};

const iconToneClasses = {
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
  red:
    "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-300",
};

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
  icon: Icon,
  iconTone = "violet",
}: SectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {Icon ? (
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconToneClasses[iconTone]}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
            ) : null}

            <div className="min-w-0">
              {title ? (
                <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                  {title}
                </h2>
              ) : null}

              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
}