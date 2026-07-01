export default {
  async fetch(request) {

    if (request.method !== "POST") {
      return new Response("Worker OK");
    }

    const update = await request.json();

    const chatId = update.message.chat.id;

    await fetch(
      "https://api.telegram.org/bot8907764089:AAH30ANfEKA61rhalwpTKJg7dQewR_QXW-Y/sendMessage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ پیام شما به Cloudflare رسید."
        })
      }
    );

    return new Response("OK");

  }
}
