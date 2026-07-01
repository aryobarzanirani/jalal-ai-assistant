export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("Telegram AI Bot is running!");
    }

    try {

      const update = await request.json();

      if (!update.message || !update.message.text) {
        return new Response("OK");
      }

      const chatId = update.message.chat.id;
      const userText = update.message.text;

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: userText
                  }
                ]
              }
            ]
          })
        }
      );

      if (!geminiResponse.ok) {

        const errorText = await geminiResponse.text();

        await sendTelegram(
          env,
          chatId,
          "❌ Gemini Error\n\n" + errorText
        );

        return new Response("OK");
      }

      const gemini = await geminiResponse.json();
            let reply = "پاسخی دریافت نشد.";

      if (
        gemini.candidates &&
        gemini.candidates.length > 0 &&
        gemini.candidates[0].content &&
        gemini.candidates[0].content.parts &&
        gemini.candidates[0].content.parts.length > 0
      ) {
        reply = gemini.candidates[0].content.parts[0].text;
      }

      await sendTelegram(env, chatId, reply);

      return new Response("OK");

    } catch (err) {

      console.error(err);

      return new Response(
        "Error: " + err.message,
        { status: 500 }
      );

    }

  }
}
async function sendTelegram(env, chatId, text) {

  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    }
  );

}
