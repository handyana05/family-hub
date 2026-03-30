import { Check, RotateCcw, Trash2, Save, Plus } from "lucide-react";

type ActionButtonVariant =
  | "primary"
  | "danger"
  | "success"
  | "ghost"
  | "wall-done"
  | "wall-reopen";

type ActionButtonIcon = "plus" | "save" | "delete" | "done" | "reopen";

type ActionButtonProps = {
  children?: React.ReactNode;
  variant?: ActionButtonVariant;
  icon?: ActionButtonIcon;
  iconOnly?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
  title?: string;
};

function Icon({ icon, className = "h-4 w-4" }: { icon?: ActionButtonIcon; className?: string }) {
  if (icon === "plus") return <Plus className={className} />;
  if (icon === "save") return <Save className={className} />;
  if (icon === "delete") return <Trash2 className={className} />;
  if (icon === "done") return <Check className={className} />;
  if (icon === "reopen") return <RotateCcw className={className} />;
  return null;
}

function variantClasses(variant: ActionButtonVariant) {
  switch (variant) {
    case "primary":
      return "bg-slate-900 text-white hover:bg-slate-800";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700";
    case "success":
      return "bg-emerald-600 text-white hover:bg-emerald-500";
    case "ghost":
      return "border text-slate-700 hover:bg-slate-50";
    case "wall-done":
      return "bg-emerald-600 text-white hover:bg-emerald-500";
    case "wall-reopen":
      return "bg-white/10 text-white hover:bg-white/15";
  }
}

export function ActionButton({
  children,
  variant = "primary",
  icon,
  iconOnly = false,
  type = "submit",
  className = "",
  ariaLabel,
  title,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      title={title}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl transition",
        iconOnly ? "p-3" : "px-4 py-2",
        variantClasses(variant),
        className,
      ].join(" ")}
    >
      <Icon icon={icon} className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
      {!iconOnly && children ? <span>{children}</span> : null}
    </button>
  );
}