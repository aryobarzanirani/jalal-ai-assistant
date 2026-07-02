export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("Jalal AI V2 is running");
    }

    const update = await request.json();

    const chatId = update.message?.chat?.id;
    const userText = update.message?.text;

    if (!chatId || !userText) {
      return new Response("OK");
    }

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

      const data = await geminiResponse.json();

      aiReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "پاسخی از Gemini دریافت نشد.";

    } catch (err) {
      aiReply = "خطا در ارتباط با Gemini.";
    }

    await fetch(
      "https://api.telegram.org/bot8907764089:AAGGNJ2-ghMmhLIdGCVgadiNgl_0pDMUFhY/sendMessage",
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
  }
}
