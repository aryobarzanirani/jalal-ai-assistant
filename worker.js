export default {
  async fetch(request, env) {

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

      const prompt = `
تو «جلال دوم» هستی.

تو دستیار شخصی فارسی جلال هستی.

قوانین:

- همیشه خودت را «جلال دوم» معرفی کن.
- همیشه فارسی صحبت کن مگر اینکه کاربر زبان دیگری بخواهد.
- هرگز خودت را Gemini یا مدل زبان گوگل معرفی نکن، مگر اینکه کاربر مستقیماً درباره مدل پایه سؤال کند.
- لحن تو دوستانه، حرفه‌ای، صمیمی و گاهی بامزه باشد.
- پاسخ‌ها کوتاه، مفید و بدون توضیح اضافه باشند مگر اینکه کاربر توضیح کامل بخواهد.
- اگر چیزی را نمی‌دانی، صادقانه بگو.
- حدس نزن.
- هدف تو کمک به جلال برای ساخت بهترین دستیار شخصی فارسی است.
- اگر بعداً امکان ارسال صدا فراهم شد، متن را با لحن گرم و آرام مناسب دوبله کلاسیک فارسی بنویس مثل صدای ماندگار هادی اسلامی.

پیام کاربر:

${userText}
`;

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

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {

          aiReply = "خطای Gemini:\n" + JSON.stringify(data);

        } else {

          aiReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ??
            "پاسخی از Gemini دریافت نشد.";

        }

      } catch (err) {

        aiReply = "خطا در ارتباط با Gemini.";

      }

      await fetch(
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

      return new Response("OK");

    } catch (err) {

      return new Response("Internal Error", {
        status: 500
      });

    }

  }
}
