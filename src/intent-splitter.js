export function splitIntent(text) {
  if (!text) return [];

  return text
    .split(/\s+(?:و|بعد|سپس)\s+/)
    .map(x => x.trim())
    .filter(Boolean);
}
