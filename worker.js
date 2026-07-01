export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return new Response("DEBUG Worker");
    }

    const update = await request.json();

    if (!update.message || !update.message.text) {
      return new Response("OK");
    }

    const chatId = update.message.chat.id;

    let text = "";

    text += env.TELEGRAM_BOT_TOKEN ? "✅ TELEGRAM_SECRET\n" : "❌ TELEGRAM_SECRET\n";
    text += env.GEMINI_API_KEY ? "✅ GEMINI_SECRET\n" : "❌ GEMINI_SECRET\n";

    await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    return new Response("OK");
  }
}
