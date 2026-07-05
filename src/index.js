// src/index.js
import { calculatePriority } from "./priority-engine.js";
import { updateDailyContext } from "./daily-context.js";
import { detectNeedPlanning, getPlanningResponse } from "./decision-engine.js";
import { extractRelationships } from "./relationship.js";
import { extractEntities } from "./entity.js";
import { getFallbackResponse } from "./fallback.js";
import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  rememberName,
  rememberGoal,
  rememberFamily,
  rememberPreference,
  rememberRelationship,
  rememberSemantic,
  isMemoryDump,
  retrieveRelevantMemory
} from "./memory.js";

import { sendTelegram } from "./telegram.js";
import { acquireLock, releaseLock } from "./lock.js";
import { getDirectResponse } from "./router.js";
import { smartRoute } from "./multi-router.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Jalal AI is running");
    }

    let chatId = null;
    let lockAcquired = false;

    try {
      const update = await request.json();
      const message = update?.message;
      if (!message) return new Response("OK");

      chatId = message.chat?.id?.toString();
      const userText = message.text?.trim();

      if (!chatId || !userText) return new Response("OK");

      lockAcquired = await acquireLock(env, chatId);
      if (!lockAcquired) {
        await sendTelegram(env, chatId, "در حال پردازش پیام قبلی هستم...");
        return new Response("OK");
      }

      if (isMemoryDump(userText)) return new Response("OK");

      const memory = await getMemory(env, chatId);
      const lines = userText.split("\n").map(x => x.trim()).filter(Boolean);

      for (const line of lines) {
        rememberName(memory, line);
        rememberGoal(memory, line);
        rememberFamily(memory, line);
        rememberPreference(memory, line);
        rememberRelationship(memory, line);
        rememberSemantic(memory, line);
        extractEntities(memory, line);
        extractRelationships(memory, line);
        updateDailyContext(memory, line);
      }

      const directResponse = getDirectResponse(memory, userText);
      let reply;

      if (directResponse) {
        reply = directResponse;
      } else {
        const relevant = await retrieveRelevantMemory(env, chatId, userText, 6);
        const context = relevant.map(r => r.text).join("\n");

        reply = await askGemini(env, context, userText);
      }

      // ذخیره گفتگو
      memory.shortTermMemory.push(`کاربر: ${userText}`);
      memory.shortTermMemory.push(`جلال: ${reply}`);
      if (memory.shortTermMemory.length > 20) memory.shortTermMemory = memory.shortTermMemory.slice(-20);

      await saveMemory(env, chatId, memory);

      await sendTelegram(env, chatId, reply);

      if (detectNeedPlanning(userText)) {
        await sendTelegram(env, chatId, getPlanningResponse());
      }

      return new Response("OK");

    } catch (err) {
      console.error("Worker Error:", err);
      if (chatId) await sendTelegram(env, chatId, "خطایی رخ داد.").catch(() => {});
      return new Response("OK");
    } finally {
      if (chatId && lockAcquired) await releaseLock(env, chatId).catch(() => {});
    }
  }
};
