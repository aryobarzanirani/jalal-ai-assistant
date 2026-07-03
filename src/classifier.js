export function classifyIntent(userText) {
  const text = userText.trim();

  if (!text) {
    return "empty";
  }

  // Greeting
  if (
    text === "سلام" ||
    text.includes("صبح بخیر") ||
    text.includes("شب بخیر")
  ) {
    return "greeting";
  }

  // Identity
  if (
    text.includes("تو کی هستی") ||
    text.includes("اسم تو چیه") ||
    text.includes("اسمت چیه")
  ) {
    return "identity";
  }

  // Memory queries
  if (
    text.includes("اسم من") ||
    text.includes("اسم دخترم") ||
    text.includes("اسم پسرم") ||
    text.includes("اسم همسرم")
  ) {
    return "memory";
  }

  // Preferences queries
  if (
    text.includes("علایق من") ||
    text.includes("به چی علاقه دارم")
  ) {
    return "memory";
  }

  // Goals / Projects queries
  if (
    text.includes("پروژه من") ||
    text.includes("روی چه پروژه")
  ) {
    return "memory";
  }

  // Status queries
  if (
    text.includes("وضعیت حافظه")
  ) {
    return "status";
  }

  // Small talk
  if (
    text.includes("خوبی") ||
    text.includes("هستی") ||
    text.includes("چطوری")
  ) {
    return "smalltalk";
  }

  return "ai";
}
