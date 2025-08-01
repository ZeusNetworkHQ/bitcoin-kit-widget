export function truncateMiddle(text: string, visibleChars: number): string {
  if (text.length <= visibleChars * 2) return text;
  return text.slice(0, visibleChars) + "..." + text.slice(-visibleChars);
}
