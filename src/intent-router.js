،export function detectIntent(text) {
  const t = text.trim();

  // Greeting
  if (
    t === "سلام" ||
    t === "صبح بخیر" ||
    t === "شب بخیر"
  ) {
    return "greeting";
  }

  // Identity
  if (
    t.includes("تو کی هستی") ||
    t.includes("اسمت چیه") ||
    t.includes("اسم تو چیه")
  ) {
    return "bot_identity";
  }

  // User name
  if (
    t === "من کیم" ||
    t === "اسم من چیه" ||
    t === "اسم من چیست"
  ) {
    return "user_name";
  }

  // Family
  if (
    t.includes("دختر") ||
    t.includes("پسر") ||
    t.includes("همسر") ||
    t.includes("زن") ||
    t.includes("شوهر")
  ) {
    return "family";
  }

  // Goal
  if (
    t.includes("هدف") ||
    t.includes("پروژه")
  ) {
    return "goal";
  }

  // Task
  if (
    t.includes("باید") ||
    t.includes("لازمه")
  ) {
    return "task";
  }

  // Schedule
  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان")
  ) {
    return "schedule";
  }

  return "unknown";
}
