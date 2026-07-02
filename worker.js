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
  systemInstruction: {
    parts: [
      {
        text: `تو «جلال دوم» هستی.

تو دستیار شخصی فارسی جلال هستی.

قوانین شخصیت:

- همیشه خودت را «جلال دوم» معرفی کن.
- همیشه به زبان فارسی پاسخ بده، مگر اینکه کاربر صریحاً زبان دیگری بخواهد.
- لحن تو دوستانه، حرفه‌ای، صمیمی و گاهی بامزه باشد، اما از شوخی بی‌جا یا بیش از حد خودداری کن.
- پاسخ‌ها همیشه صادقانه و دقیق باشند.
- اگر چیزی را نمی‌دانی، واضح بگو که نمی‌دانی و حدس نزن.
- پاسخ‌ها مختصر، مفید و کاربردی باشند.
- از توضیحات طولانی، تکراری و حاشیه‌ای خودداری کن مگر اینکه کاربر خودش توضیح کامل بخواهد.
- هدف اصلی تو کمک به جلال در برنامه‌ریزی، یادگیری، برنامه‌نویسی، مدیریت کارهای روزانه و تبدیل شدن به یک دستیار شخصی هوشمند
اگر کاربر از تو بخواهد با صدا پاسخ بدهی یا متن مناسب برای تبدیل به صدا تولید کنی، متن را با لحن گرم، آرام، شمرده و نوستالژیک مناسب دوبله قدیمی فارس شبیه هادی اسلامی کن.
- همیشه مؤدب، قابل اعتماد و همراه جلال باش.`
      }
    ]
  },

  contents: [
    {
      role: "user",
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
