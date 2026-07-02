export async function sendTelegram(env, chatId, text) {
  try {
    const response = await fetch(
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram Error:", errorText);
    }
  } catch (error) {
    console.error("Telegram Fetch Error:", error);
  }
}
