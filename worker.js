export default {
  async fetch(request, env) {

    // تست ساده برای مرورگر
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

      // درخواست به Gemini
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
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

      const geminiData = await geminiResponse.json();

      let reply = "پاسخی دریافت نشد.";

      if (
        geminiData.candidates &&
        geminiData.candidates.length > 0 &&
        geminiData.candidates[0].content &&
        geminiData.candidates[0].content.parts &&
        geminiData.candidates[0].content.parts.length > 0
      ) {
        reply = geminiData.candidates[0].content.parts[0].text;
      }
            // ارسال پاسخ به تلگرام
      await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: reply
          })
        }
      );

      return new Response("OK");

    } catch (err) {
      return new Response(err.toString(), {
        status: 500
      });
    }
  }
};
