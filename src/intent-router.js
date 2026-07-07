export function detectIntent(text) {
  const t = text.trim();

  // Greeting
  if (
    t === "سلام" ||
    t === "صبح بخیر" ||
    t === "شب بخیر"
  ) {
    return "greeting";
  }

  // Small Talk
  if (
    t.includes("خوبی") ||
    t.includes("چطوری")
  ) {
    return "smalltalk";
  }

  // Bot Identity
  if (
    t.includes("تو کی هستی") ||
    t.includes("اسمت چیه") ||
    t.includes("اسم تو چیه") ||
    t.includes("کارت چیه")
  ) {
    return "bot_identity";
  }

  // User Identity
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

  // Preferences
  if (
    t.includes("علاقه") ||
    t.includes("دوست دارم")
  ) {
    return "preferences";
  }

  // Goals / Projects
  if (
    t.includes("هدف") ||
    t.includes("پروژه")
  ) {
    return "goal";
  }

  // Tasks
  if (
    t.includes("باید") ||
    t.includes("لازمه")
  ) {
    return "task";
  }

  // Schedule
  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان") ||
    t.includes("امروز") ||
    t.includes("فردا")
  ) {
    return "schedule";
  }

  // Memory
  if (
    t.includes("وضعیت حافظه") ||
    t.includes("حافظه")
  ) {
    return "memory_status";
  }

  return "unknown";
}
