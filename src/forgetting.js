function scoreItem(item) {

  if (!item) return 0;

  const text =
    typeof item === "string"
      ? item
      : item.text || "";

  let score = 0;

  if (text.includes("اسم")) score += 5;
  if (text.includes("دختر")) score += 5;
  if (text.includes("همسر")) score += 5;
  if (text.includes("هدف")) score += 4;
  if (text.includes("پروژه")) score += 4;
  if (text.includes("دوست دارم")) score += 3;
  if (text.includes("باید")) score += 2;

  return score;
}

export function forgettingPolicy(memory) {

  memory.shortTermMemory =
    (memory.shortTermMemory || [])
      .sort((a, b) => scoreItem(b) - scoreItem(a))
      .slice(0, 20);

  memory.longTermMemory =
    (memory.longTermMemory || [])
      .sort((a, b) => scoreItem(b) - scoreItem(a))
      .slice(0, 100);
}
