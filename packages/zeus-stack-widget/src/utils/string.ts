export function truncateMiddle(
  text: string,
  visibleFrontChars: number,
  visibleEndChars = visibleFrontChars,
): string {
  if (text.length <= visibleFrontChars + visibleEndChars) return text;
  return (
    text.slice(0, visibleFrontChars) + "..." + text.slice(-visibleEndChars)
  );
}
