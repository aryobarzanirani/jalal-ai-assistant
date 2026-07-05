// src/gemini.js
import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, relevantContext, userText) {
  const profile = {}; // فعلاً ساده نگه داشتیم
  const shortTerm = [];
  const longTerm = [];

  const prompt = `
${SYSTEM_PROMPT}

=== اطلاعات مرتبط ===
${relevantContext || "هیچ"}

=== پیام کاربر ===
${userText}

پاسخ جلال دوم:
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "در حال حاضر مدل شلوغ است. کمی بعد دوباره امتحان کن.";
  }
}
