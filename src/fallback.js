export function getFallbackResponse(userText) {
  const text = userText.trim();

  if (text.includes("سلام")) {
    return "سلام. در خدمتم.";
  }

  if (text.includes("کمک")) {
    return "بله، بگو در چه زمینه‌ای کمکت کنم.";
  }

  if (text.includes("پروژه")) {
    return "فعلاً دسترسی به مدل هوش مصنوعی ندارم اما حافظه پروژه شما محفوظ است.";
  }

  return "فعلاً ارتباط با مدل هوش مصنوعی برقرار نیست. کمی بعد دوباره تلاش کنید.";
}
