export function getEventChipStyle(categoryColor?: string | null) {
  if (!categoryColor) {
    return {
      backgroundColor: "#e2e8f0",
      color: "#334155",
      borderColor: "#cbd5e1",
    };
  }

  return {
    backgroundColor: `${categoryColor}22`,
    color: categoryColor,
    borderColor: `${categoryColor}55`,
  };
}