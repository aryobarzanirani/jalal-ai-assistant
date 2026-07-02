import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, memory, userText) {
  const profile = memory.profile || {
    name: null,
    preferences: [],
    goals: []
  };

  const shortTermMemory =
    memory.shortTermMemory || [];

  const longTermMemory =
    memory.longTermMemory || [];

  const profileText = `
نام کاربر: ${profile.name || "نامشخص"}

ترجیحات:
${
  profile.preferences.length
    ? profile.preferences.join("\n")
    : "موردی ثبت نشده"
}

اهداف:
${
  profile.goals.length
    ? profile.goals.join("\n")
    : "موردی ثبت نشده"
}
`;

  const shortTermText =
    shortTermMemory
      .slice(-20)
      .join("\n");

  const longTermText =
    longTermMemory
      .slice(-10)
      .join("\n");

  const prompt = `
${SYSTEM_PROMPT}

=== پروفایل کاربر ===
${profileText}

=== حافظه بلندمدت ===
${longTermText}

=== گفتگوهای اخیر ===
${shortTermText}

=== پیام جدید کاربر ===
${userText}
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
          ]
        })
      }
    );

    if (response.status === 429) {
      return "ظرفیت مدل هوش مصنوعی فعلاً تکمیل شده. لطفاً کمی بعد دوباره تلاش کنید.";
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Error:", errorText);

      return "در ارتباط با مدل هوش مصنوعی خطایی رخ داد.";
    }

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "پاسخی دریافت نشد."
    );
  } catch (error) {
    console.error("Gemini Fetch Error:", error);

    return "فعلاً امکان پاسخ‌گویی ندارم.";
  }
}
