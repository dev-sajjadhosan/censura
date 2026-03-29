export const parseNullableNumber = (value: any): number | null => {
  if (value === "null" || value === "" || value === undefined || value === null) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};

export const normalizeIds = (arr: any[]): string[] =>
  arr.map((item) => (typeof item === "string" ? item : item.id));