import { SYSTEM_PROMPT } from "./prompt.js";

export async function askGemini(env, memory, userText) {

  const name =
    memory.name
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        contents:[
          {
            role:"user",
            parts:[
              {
                text:prompt
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "پاسخی دریافت نشد."
  );

}
