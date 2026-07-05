export function splitSentences(text) {
  if (!text) return [];

  return text
    .replace(/\r/g, "")
    .split(/[\n.!؟?]+/)
    .map(s => s.trim())
    .filter(Boolean);
}
