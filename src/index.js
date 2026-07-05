// src/index.js
import { calculatePriority } from "./priority-engine.js";
import { updateDailyContext } from "./daily-context.js";
import {
  detectNeedPlanning,
  getPlanningResponse
} from "./decision-engine.js";
import { extractRelationships } from "./relationship.js";
import { extractEntities } from "./entity.js";
import { getFallbackResponse } from "./fallback.js";
import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  saveWithVector,
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
import {
  acquireLock,
  releaseLock
} from "./lock.js";
import { getDirectResponse } from "./router.js";
import { smartRoute } from "./multi-router.js";
import { detectRequestType } from "./utils.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Jalal AI V3 is running");
    }

    let chatId = null;
    let lockAcquired = false;

    try {
      const update = await request.json();
      const message = update?.message;

      if (!message) return new Response("OK");

      chatId = message?.chat?.id?.toString();
      const userText = message?.text?.trim();

      if (!chatId || !userText) {
        return new Response("OK");
      }

      lockAcquired = await acquireLock(env, chatId);

      if (!lockAcquired) {
        await sendTelegram(env, chatId, "در حال پردازش پیام قبلی هستم. لطفاً کمی صبر کنید.");
        return new Response("OK");
      }

      if (isMemoryDump(userText)) {
        console.log("MEMORY DUMP BLOCKED");
        return new Response("OK");
      }

      const memory = await getMemory(env, chatId);
      const lines = userText.split("\n").map(x => x.trim()).filter(Boolean);

      // === Memory Processing ===
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

      // Priority
      for (const line of lines) {
        const priorityData = calculatePriority(memory, line);
        if (priorityData.score >= 5) {
          memory.priorities = memory.priorities || [];
          memory.priorities.push({
            text: line,
            score: priorityData.score,
            category: priorityData.category,
            timestamp: new Date().toISOString().slice(0, 10)
          });
        }
      }

      if (memory.priorities?.length > 50) {
        memory.priorities = memory.priorities.slice(-50);
      }

      // === Routing & Response ===
      const directResponse = getDirectResponse(memory, userText);
      let reply;

      if (directResponse) {
        reply = directResponse;
      } else {
        // Semantic Retrieval + Vector Search
        const vectorMemory = await retrieveRelevantMemory(env, chatId, userText, 8);
        const traditionalMemory = []; // اگر retriever.js داری می‌توانی ترکیب کنی

        const relevantContext = [...vectorMemory, ...traditionalMemory]
          .map(item => item.text || item)
          .join("\n");

        // Multi-Model Routing
        const route = smartRoute(env, { text: userText, priority: 5 }, memory);

        try {
          reply = await askGemini(env, relevantContext, userText, route.model);
        } catch (err) {
          console.error("Gemini Error:", err);
          reply = getFallbackResponse(userText);
        }
      }

      // Save Conversation
      memory.shortTermMemory.push(`کاربر: ${userText}`);
      memory.shortTermMemory.push(`جلال: ${reply}`);

      if (memory.shortTermMemory.length > 20) {
        memory.shortTermMemory = memory.shortTermMemory.slice(-20);
      }

 // Save Memory + Vector
await saveMemory(env, chatId, memory);

// فعلاً غیرفعال کردیم تا quota کمتر مصرف شود
// if (userText.length > 20) {
//   await saveWithVector(env, chatId, "conversation", userText, { type: "user" });
//   await saveWithVector(env, chatId, "response", reply, { type: "assistant" });
// }

      await sendTelegram(env, chatId, reply);

      // Planning
      if (detectNeedPlanning(userText)) {
        const planningReply = getPlanningResponse(memory, userText);
        await sendTelegram(env, chatId, planningReply);
      }

      return new Response("OK");

    } catch (err) {
      console.error("Worker Error:", err);
      if (chatId) {
        await sendTelegram(env, chatId, "خطایی رخ داد. لطفاً دوباره امتحان کنید.").catch(() => {});
      }
      return new Response("OK");
    } finally {
      if (chatId && lockAcquired) {
        await releaseLock(env, chatId).catch(() => {});
      }
    }
  }
};
