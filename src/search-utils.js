function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function similarity(a, b) {
  const wa = normalize(a).split(" ");
  const wb = normalize(b).split(" ");

  let score = 0;

  for (const word of wa) {
    if (wb.includes(word)) {
      score++;
    }
  }

  return score;
}
