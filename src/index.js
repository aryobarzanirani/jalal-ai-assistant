import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  rememberName
} from "./memory.js";
import { sendTelegram } from "./telegram.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Jalal AI is running");
    }

    try {
      const update = await request.json();

      const message = update?.message;

      if (!message) {
        return new Response("OK");
      }

      const chatId = message?.chat?.id?.toString();
      const userText = message?.text;

      if (!chatId) {
        return new Response("OK");
      }

      if (!userText) {
        await sendTelegram(
          env,
          chatId,
          "فعلاً فقط پیام متنی را پردازش می‌کنم."
        );

        return new Response("OK");
      }

      const memory = await getMemory(env, chatId);

      rememberName(memory, userText);

      const reply = await askGemini(
        env,
        memory,
        userText
      );

      memory.history.push(`کاربر: ${userText}`);
      memory.history.push(`جلال دوم: ${reply}`);

      if (memory.history.length > 20) {
        memory.history = memory.history.slice(-20);
      }

      await saveMemory(env, chatId, memory);

      await sendTelegram(env, chatId, reply);

      return new Response("OK");
    } catch (err) {
      console.error("Worker Error:", err);

      return new Response(
        "Internal Error",
        {
          status: 500
        }
      );
    }
  }
};
