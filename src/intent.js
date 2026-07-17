export function classifyIntent(userText) {
  const text = userText.trim();

  if (!text) {
    return "empty";
  }

  // Layer 1 → Direct Router
  const routerPatterns = [
    "اسم من چیه",
    "اسم من چیست",
    "اسم دخترم چیه",
    "اسم دخترم چیست",
    "اسم پسرم چیه",
    "اسم همسرم چیه",
    "تو کی هستی",
    "وضعیت حافظه",
    "پروژه من چیه",
    "پروژه من چیست",
    "علایق من چیه",
    "به چی علاقه دارم"
  ];

  for (const pattern of routerPatterns) {
    if (text.includes(pattern)) {
      return "router";
    }
  }

  // Layer 2 → Memory Reasoning
  const reasoningPatterns = [
    "چه نسبتی",
    "یادت هست",
    "آخرین بار",
    "درباره چی",
    "کجا رفت",
    "کی بود"
  ];

  for (const pattern of reasoningPatterns) {
    if (text.includes(pattern)) {
      return "reasoning";
    }
  }

  // Layer 3 → AI
  return "gemini";
}
