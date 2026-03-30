import { ActionButton } from "@/components/action-button";

type WallActionButtonProps = {
  type: "done" | "reopen";
  label: string;
};

export function WallActionButton({ type, label }: WallActionButtonProps) {
  return (
    <ActionButton
      variant={type === "done" ? "wall-done" : "wall-reopen"}
      icon={type}
      iconOnly
      ariaLabel={label}
      title={label}
      className="ring-1 ring-transparent dark:ring-0"
    />
  );
}