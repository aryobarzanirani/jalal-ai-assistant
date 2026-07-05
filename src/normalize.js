export function normalizeInput(text) {
  if (!text) return "";

  return text
    .replace(/\u200c/g, " ")      // حذف نیم‌فاصله
    .replace(/\u200f/g, "")
    .replace(/\u200e/g, "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ـ]/g, "")
    .trim();
}
