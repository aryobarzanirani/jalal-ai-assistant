export default {
  async fetch(request, env) {

    // تست سلامت Worker
    if (request.method !== "POST") {
      return new Response("Jalal AI V2 is running");
    }

    try {

      const update = await request.json();

      const chatId = update.message?.chat?.id;
      const userText = update.message?.text;

      if (!chatId || !userText) {
        return new Response("OK");
      }

      // ---------- Gemini ----------

      let aiReply = "متأسفم، پاسخی دریافت نشد.";

      try {

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
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

        if (!geminiResponse.ok) {

          aiReply =
            "خطای Gemini:\n" +
            JSON.stringify(geminiData);

        } else {

          aiReply =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
            "Gemini پاسخی برنگرداند.";

        }

      } catch (e) {

        aiReply =
          "خطا در اتصال به Gemini:\n" +
          e.message;

      }

      // ---------- Telegram ----------

      const telegramResponse = await fetch(

        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: aiReply
          })
        }

      );

      if (!telegramResponse.ok) {

        console.log(
          "Telegram Error:",
          await telegramResponse.text()
        );

      }

      return new Response("OK");

    } catch (err) {

      console.log(err);

      return new Response("Internal Error", {
        status: 500
      });

    }

  }
}
