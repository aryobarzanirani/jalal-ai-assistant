// src/multi-router.js
export function smartRoute(env, message, memory) {
  const text = message.text || "";
  const priority = message.priority || 5;

  const isComplex = text.length > 250 || 
    /برنامه|سفر|سرمایه|تحلیل|محاسبه|دوبله|خلاصه/.test(text);

  let model = "gemini-2.5-flash-exp"; // پیش‌فرض سریع

  if (isComplex || priority >= 7) {
    model = "gemini-2.5-pro-exp-03-25"; // یا مدل قوی‌تر
  }

  return { model, reason: isComplex ? "complex" : "normal" };
}
