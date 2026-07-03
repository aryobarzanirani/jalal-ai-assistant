import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, memory, userText) {
  const profile = memory.profile || {};import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, memory, userText) {
  const profile = memory.profile || {};
  const shortTermMemory = memory.shortTermMemory || [];
  const longTermMemory = memory.longTermMemory || [];

  const profileBlock = `
=== اطلاعات قطعی ذخیره‌شده کاربر ===
نام: ${profile.name || "ثبت نشده"}
ترجیحات: ${
    profile.preferences?.length
      ? profile.preferences.join(" | ")
      : "ثبت نشده"
  }
اهداف: ${
    profile.goals?.length
      ? profile.goals.join(" | ")
      : "ثبت نشده"
  }
`;

  const longTermBlock = `
=== حافظه بلندمدت ===
${
  longTermMemory.length
    ? longTermMemory.slice(-10).join("\n")
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

پاسخ جلال دوم:
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
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
      console.error(
        "Gemini Error:",
        response.status,
        JSON.stringify(data)
      );

      if (response.status === 429) {
        return "ظرفیت Gemini فعلاً تکمیل شده. کمی بعد دوباره تلاش کنید.";
      }

      if (response.status >= 500) {
        return "سرور مدل هوش مصنوعی موقتاً در دسترس نیست.";
      }

      return `خطای Gemini (${response.status})`;
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error(
        "Gemini Empty Response:",
        JSON.stringify(data)
      );
      return "پاسخ معتبری از مدل دریافت نشد.";
    }

    return reply;

  } catch (err) {
    console.error("Gemini Fetch Error:", err);
    return "ارتباط با Gemini برقرار نشد.";
  }
}
  const shortTermMemory = memory.shortTermMemory || [];
  const longTermMemory = memory.longTermMemory || [];

  const profileBlock = `
=== اطلاعات قطعی ذخیره‌شده کاربر ===
نام: ${profile.name || "ثبت نشده"}
ترجیحات: ${
    profile.preferences?.length
      ? profile.preferences.join(" | ")
      : "ثبت نشده"
  }
اهداف: ${
    profile.goals?.length
      ? profile.goals.join(" | ")
      : "ثبت نشده"
  }
`;

  const longTermBlock = `
=== حافظه بلندمدت ===
${
  longTermMemory.length
    ? longTermMemory.slice(-10).join("\n")
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

پاسخ جلال دوم:
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
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
      console.error("Gemini Error:", JSON.stringify(data));
      return "در ارتباط با مدل هوش مصنوعی خطایی رخ داد.";
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "پاسخی دریافت نشد."
    );

  } catch (err) {
    console.error("Gemini Fetch Error:", err);
    return "در ارتباط با مدل هوش مصنوعی خطایی رخ داد.";
  }
}
