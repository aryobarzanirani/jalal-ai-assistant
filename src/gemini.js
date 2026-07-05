// src/gemini.js
import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, relevantContext, userText, modelName = null) {
  const memory = relevantContext ? { /* اگر لازم بود */ } : {};

  // ساخت پرامپت
  const prompt = buildPrompt(relevantContext, userText);

  // اگر modelName پاس نشده، از Flash استفاده کن (پیش‌فرض)
  const model = modelName || "gemini-2.5-flash-exp";

  const apiKeys = getGeminiKeys(env); // فرض بر این است که این تابع وجود دارد

  if (!apiKeys.length) {
    return "هیچ کلید API برای Gemini تنظیم نشده است.";
  }

  for (const apiKey of apiKeys) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/\( {model}:generateContent?key= \){apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: model.includes("flash") ? 0.8 : 0.6,
              maxOutputTokens: model.includes("pro") ? 8192 : 4096,
              topP: 0.95,
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(`Gemini ${model} Error:`, data);

        if (response.status === 429 || 
            (data?.error?.message || "").toLowerCase().includes("quota")) {
          continue; // امتحان کلید بعدی
        }

        return "در حال حاضر مدل هوش مصنوعی شلوغ است. کمی بعد دوباره امتحان کن.";
      }

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return reply || "پاسخی دریافت نشد.";

    } catch (err) {
      console.error(`Gemini Fetch Error (${model}):`, err);
    }
  }

  return "تمام کلیدهای Gemini در حال حاضر در دسترس نیستند. لطفاً بعداً امتحان کنید.";
}

/** ساخت پرامپت تمیز و مرتب */
function buildPrompt(relevantContext, userText) {
  return `
${SYSTEM_PROMPT}

=== اطلاعات مرتبط از حافظه ===
${relevantContext || "هیچ اطلاعات خاصی از قبل ثبت نشده."}

=== پیام فعلی کاربر ===
${userText}

قوانین پاسخ‌دهی:
- همیشه به فارسی پاسخ بده.
- از اطلاعات حافظه استفاده کن اما اگر مطمئن نیستی، حدس نزن.
- پاسخ را طبیعی، دوستانه و مفید بده.
- اگر نیاز به اطلاعات بیشتر داری، مستقیم بپرس.

پاسخ جلال دوم:
`;
}

// تابع کمکی (اگر قبلاً داشتی نگه دار)
function getGeminiKeys(env) {
  const keys = [];
  if (env.GEMINI_API_KEY) keys.push(env.GEMINI_API_KEY);
  if (env.GEMINI_API_KEY_2) keys.push(env.GEMINI_API_KEY_2);
  if (env.GEMINI_API_KEY_3) keys.push(env.GEMINI_API_KEY_3);
  return keys;
}
