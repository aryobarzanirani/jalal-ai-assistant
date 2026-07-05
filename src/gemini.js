// src/gemini.js - نسخه سبک برای تست
export async function askGemini(env, relevantContext, userText, modelName = "gemini-2.5-flash-exp") {
  const prompt = `
تو جلال دوم، دستیار شخصی من هستی. دوستانه و مفید پاسخ بده.

اطلاعات مرتبط:
${relevantContext || "هیچ"}

پیام کاربر: ${userText}

پاسخ:
`;

  const key = env.GEMINI_API_KEY;
  if (!key) return "کلید API تنظیم نشده.";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${key}`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      }
    );

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
  } catch (e) {
    console.error(e);
    return "در حال حاضر کمی شلوغم. بعداً دوباره بپرس.";
  }
}
