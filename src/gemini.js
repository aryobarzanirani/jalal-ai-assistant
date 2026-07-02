import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, memory, userText) {
  const name = memory.name
    ? `نام کاربر: ${memory.name}\n`
    : "";

  const history = memory.history
    .slice(-10)
    .join("\n");

  const prompt = `
${SYSTEM_PROMPT}

${name}

سابقه گفتگو:
${history}

کاربر:
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Error:", errorText);

      return `GEMINI ERROR:\n${errorText}`;
    }

    if (response.status === 429) {
  return "ظرفیت مدل فعلاً تکمیل شده. لطفاً کمی بعد دوباره تلاش کنید.";
    }
    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "پاسخی دریافت نشد."
    );
  } catch (error) {
    console.error("Gemini Fetch Error:", error);

    return `FETCH ERROR: ${error.message}`;
  }
}
