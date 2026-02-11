export function normalizeText(text: string): string {
  return text
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(
  text: string,
  maxLength: number,
  ellipsis = '...',
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length).trimEnd() + ellipsis;
}

export function truncateForDisplay(
  text: string,
  maxLength: number,
  ellipsis = '...',
): string {
  return truncateText(normalizeText(text), maxLength, ellipsis);
}
