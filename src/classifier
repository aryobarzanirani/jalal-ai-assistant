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

  // Memory queries
  if (
    text.includes("اسم من") ||
    text.includes("اسم دخترم") ||
    text.includes("اسم پسرم") ||
    text.includes("اسم همسرم")
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
