export const TitleCaseFormat = (text: string) => {
  return text
    .toLocaleLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(" ");
};
