import { SYSTEM_PROMPT } from "./prompt.js";
import { getGeminiKeys } from "./gemini-keys.js";

export async function askGemini(env, memory, userText) {
  const profile = memory.profile || {};
  const shortTermMemory = memory.shortTermMemory || [];
  const longTermMemory = memory.longTermMemory || [];

  const profileBlock = `
=== اطلاعات قطعی کاربر ===
نام: ${profile.name || "ثبت نشده"}

خانواده:
${
  profile.family?.length
    ? profile.family.join("\n")
    : "ثبت نشده"
}

علایق:
${
  profile.preferences?.length
    ? profile.preferences.join("\n")
    : "ثبت نشده"
}

اهداف:
${
  profile.goals?.length
    ? profile.goals.join("\n")
    : "ثبت نشده"
}
`;

  const longTermBlock = `
=== حافظه بلندمدت ===
${
  longTermMemory.length
    ? longTermMemory.slice(-15).join("\n")
    : "موردی ثبت نشده"
}
`;

  const shortTermBlock = `
=== گفتگوهای اخیر ===
${
  shortTermMemory.length
    ? shortTermMemory.slice(-12).join("\n")
    : "گفتگویی ثبت نشده"
}
`;

  const prompt = `
${SYSTEM_PROMPT}

${profileBlock}

${longTermBlock}

${shortTermBlock}

=== پیام جدید کاربر ===
${userText}

قوانین مهم:
- از اطلاعات حافظه استفاده کن.
- تناقض نساز.
- اگر اطلاعاتی در حافظه موجود نیست، صادقانه بگو.
- اگر نام کاربر ثبت شده، در مواقع مناسب استفاده کن.

پاسخ جلال دوم:
`;

  const apiKeys = getGeminiKeys(env);

  if (!apiKeys.length) {
    return "هیچ Gemini API Key تنظیم نشده است.";
  }

  for (const apiKey of apiKeys) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error?.message || "";

        console.error(
          "Gemini Error:",
          JSON.stringify(data)
        );

        const quotaExceeded =
          response.status === 429 ||
          errorMessage.includes("quota") ||
          errorMessage.includes("Quota");

        if (quotaExceeded) {
          continue;
        }

        return "در ارتباط با مدل هوش مصنوعی خطایی رخ داد.";
      }

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "پاسخی دریافت نشد."
      );

    } catch (err) {
      console.error(
        "Gemini Fetch Error:",
        err
      );
    }
  }

  return "ظرفیت تمام API Key های Gemini تکمیل شده است.";
}
