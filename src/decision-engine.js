export function detectNeedPlanning(userText) {
  const text = userText.trim();

  const triggers = [
    "کار زیاد دارم",
    "خیلی کار دارم",
    "برنامه ریزی",
    "برنامه‌ریزی",
    "سردرگم",
    "نمی‌دونم از کجا شروع کنم",
    "کارام زیاده",
    "امروز شلوغه"
  ];

  for (const trigger of triggers) {
    if (text.includes(trigger)) {
      return true;
    }
  }

  return false;
}

export function getPlanningResponse() {
  return [
    "به نظر می‌رسد نیاز به برنامه‌ریزی دارید.",
    "کارها را یکی‌یکی برای من بنویس تا با هم اولویت‌بندی کنیم."
  ].join("\n");
}
