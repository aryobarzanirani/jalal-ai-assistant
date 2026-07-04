export function calculatePriority(memory, text) {
  const t = text.trim();

  let score = 1;
  let category = "normal";

  if (
    t.includes("باید") ||
    t.includes("ضروری") ||
    t.includes("مهم")
  ) {
    score += 3;
    category = "important";
  }

  if (
    t.includes("امروز") ||
    t.includes("امشب")
  ) {
    score += 2;
    category = "urgent";
  }

  if (
    t.includes("خانواده") ||
    t.includes("دخترم") ||
    t.includes("همسرم")
  ) {
    score += 4;
  }

  if (
    t.includes("شیفت") ||
    t.includes("کار")
  ) {
    score += 2;
  }

  return {
    score,
    category
  };
}
