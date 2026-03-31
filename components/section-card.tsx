type SectionCardProps = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
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

          {actions ? <div>{actions}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
}