type FamilyAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  color?: string | null;
  size?: "sm" | "md";
};

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "?";
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function FamilyAvatar({
  name,
  avatarUrl,
  color,
  size = "sm",
}: FamilyAvatarProps) {
  const sizeClass =
    size === "md"
      ? "h-11 w-11 text-sm"
      : "h-9 w-9 text-xs";

  const initials = getInitials(name);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        title={name}
        className={`${sizeClass} rounded-full border-2 border-white/20 object-cover shadow-sm`}
      />
    );
  }

  return (
    <div
      title={name}
      aria-label={name}
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border-2 border-white/20 font-semibold text-white shadow-sm`}
      style={{
        backgroundColor: color ?? "#6366f1",
      }}
    >
      {initials}
    </div>
  );
}