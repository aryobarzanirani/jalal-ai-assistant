// src/utils.js
export function cleanText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\u200B/g, "")
    .replace(/\uFEFF/g, "")
    .trim();
}

export function isJsonLike(text) {
  if (!text || text.length < 10) return false;
  const t = text.trim();
  return (t.startsWith("{") && t.endsWith("}")) || 
         (t.startsWith("[") && t.endsWith("]"));
}

export async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getChatId(ctx) {
  return ctx.chat?.id?.toString() || ctx.from?.id?.toString();
}

export function isVoiceOrVideo(msg) {
  return !!(msg.voice || msg.video || msg.video_note || msg.document);
}

export function isImage(msg) {
  return !!msg.photo;
}

/**
 * تشخیص نوع درخواست برای routing
 */
export function detectRequestType(text) {
  const t = text.toLowerCase();
  if (/محاسبه|حساب|ریاضی|قیمت/.test(t)) return "calculation";
  if (/برنامه|زمانبندی|روزانه|سفر/.test(t)) return "planning";
  if (/سرمایه|سهام|خرید|فروش/.test(t)) return "investment";
  if (/تحلیل|خلاصه|خلاصه کن/.test(t)) return "analysis";
  if (/بساز|تولید|عکس|تصویر/.test(t)) return "generation";
  return "general";
}
