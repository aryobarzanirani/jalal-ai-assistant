import { calculatePriority } from "./priority-engine.js";
import { updateDailyContext } from "./daily-context.js";
import {
  detectNeedPlanning,
 getPlanningResponse
} from "./decision-engine.js";
import { extractRelationships } from "./relationship.js";
import { extractEntities } from "./entity.js";
import { classifyIntent } from "./intent.js";
import { getFallbackResponse } from "./fallback.js";
import { getRelevantMemory } from "./retriever.js";
import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  rememberName,
  rememberGoal,
  rememberFamily,
  rememberPreference,
  rememberRelationship,
  rememberSemantic
} from "./memory.js";
import { sendTelegram } from "./telegram.js";
import {
  acquireLock,
  releaseLock
} from "./lock.js";
import { getDirectResponse } from "./router.js";

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

      if (!message) {
        return new Response("OK");
      }

      chatId = message?.chat?.id?.toString();
      const userText = message?.text;

      if (!chatId) {
        return new Response("OK");
      }

      lockAcquired = await acquireLock(env, chatId);

      if (!lockAcquired) {
        await sendTelegram(
          env,
          chatId,
          "در حال پردازش پیام قبلی هستم. لطفاً چند ثانیه صبر کنید."
        );
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
      rememberGoal(memory, userText);
      rememberFamily(memory, userText);
      rememberRelationship(memory, userText);
      rememberPreference(memory, userText);
      rememberSemantic(memory, userText);

      extractEntities(memory, userText);
      extractRelationships(memory, userText);
      updateDailyContext(memory, userText);
const priorityData =
  calculatePriority(memory, userText);

if (priorityData.score >= 5) {
  if (!memory.priorities) {
    memory.priorities = [];
  }

  memory.priorities.push({
    text: userText,
    score: priorityData.score,
    category: priorityData.category,
    timestamp: new Date()
      .toISOString()
      .slice(0, 10)
  });

  if (memory.priorities.length > 50) {
    memory.priorities =
      memory.priorities.slice(-50);
  }
}
      classifyIntent(userText);

      const directResponse =
        getDirectResponse(memory, userText);

      let reply;

      if (directResponse) {
        reply = directResponse;
      } else {
        const relevantMemory =
          getRelevantMemory(memory, userText);

        try {
          reply = await askGemini(
            env,
            relevantMemory,
            userText
          );
        } catch {
          reply = getFallbackResponse(userText);
        }
      }

      memory.shortTermMemory.push(
        `کاربر: ${userText}`
      );

      memory.shortTermMemory.push(
        `جلال دوم: ${reply}`
      );

      if (memory.shortTermMemory.length > 20) {
        memory.shortTermMemory =
          memory.shortTermMemory.slice(-20);
      }

      await saveMemory(env, chatId, memory);

      await sendTelegram(env, chatId, reply);

      if (detectNeedPlanning(userText)) {
        const planningReply =
          getPlanningResponse();

        await sendTelegram(
          env,
          chatId,
          planningReply
        );
      }

      return new Response("OK");

    } catch (err) {
      const errorMessage =
        err?.stack ||
        err?.message ||
        JSON.stringify(err);

      console.error(
        "Worker Error FULL:",
        errorMessage
      );

      if (chatId) {
        try {
          await sendTelegram(
            env,
            chatId,
            "خطای داخلی رخ داد. لطفاً دوباره تلاش کنید."
          );
        } catch {}
      }

      return new Response("OK");

    } finally {
      if (chatId && lockAcquired) {
        try {
          await releaseLock(env, chatId);
        } catch (e) {
          console.error(
            "Lock Release Error:",
            e
          );
        }
      }
    }
  }
};
