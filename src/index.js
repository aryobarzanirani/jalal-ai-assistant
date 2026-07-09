import { detectIntent } from "./intent.js";
import { extractEntities } from "./extractEntities.js";

import { getDirectResponse } from "./router.js";
import { getFallbackResponse } from "./fallback.js";

import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  rememberEntity,
  isMemoryDump
} from "./memory.js";
import { forgettingPolicy } from "./forgetting.js";
import { promoteMemory } from "./memory-promotion.js";
import { consolidateMemory } from "./memory-consolidator.js";
import { cleanupMemory } from "./memory-lifecycle.js";

import { rememberSynonym } from "./dynamic-synonyms.js";

import { resolveLastTask } from "./context-resolver.js";
import { completeLastTask } from "./task-manager.js";

import { splitSentences } from "./splitter.js";
import { normalizeInput } from "./normalize.js";

import { calculatePriority } from "./priority-engine.js";
import { updateDailyContext } from "./daily-context.js";

import {
  detectNeedPlanning,
  getPlanningResponse
} from "./decision-engine.js";

import { extractRelationships } from "./relationship.js";

import { getRelevantMemory } from "./retriever.js";

import { sendTelegram } from "./telegram.js";

import {
  acquireLock,
  releaseLock
} from "./lock.js";

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

if (!userText) {
  await sendTelegram(
    env,
    chatId,
    "فعلاً فقط پیام متنی را پردازش می‌کنم."
  );
  return new Response("OK");
}

const normalizedText = normalizeInput(userText);

lockAcquired = await acquireLock(env, chatId);

if (!lockAcquired) {
  await sendTelegram(
    env,
    chatId,
    "در حال پردازش پیام قبلی هستم. لطفاً چند ثانیه صبر کنید."
  );
  return new Response("OK");
}

if (isMemoryDump(normalizedText)) {
  console.log("MEMORY DUMP BLOCKED");
  return new Response("OK");
}

const memory = await getMemory(env, chatId);

const lines = splitSentences(normalizedText);

for (const line of lines) {

  const entities = extractEntities(line);
  rememberEntity(memory, entity);

  rememberSynonym(memory, line);

  extractRelationships(memory, line);

  updateDailyContext(memory, line);

  const priorityData = calculatePriority(
    memory,
    line
  );

  if (priorityData.score >= 5) {

    memory.priorities ??= [];

    if (
      !memory.priorities.some(
        p => p.text === line
      )
    ) {
      memory.priorities.push({
        text: line,
        score: priorityData.score,
        category: priorityData.category,
        timestamp: new Date()
          .toISOString()
          .slice(0, 10)
      });
    }
  }
}
      memory.priorities ??= [];

if (memory.priorities.length > 50) {
  memory.priorities = memory.priorities.slice(-50);
}

const finalIntent =
    detectIntent(normalizedText);
const entities =
    extractEntities(normalizedText);
const directResponse =
    getDirectResponse(
        memory,
        normalizedText,
        finalIntent,
        entities
    );

let reply = null;
// Task Completion
if (
  normalizedText.includes("انجام شد") ||
  normalizedText.includes("انجامش دادم") ||
  normalizedText.includes("تموم شد") ||
  normalizedText.includes("حل شد")
) {
  const task = completeLastTask(memory);

  if (task) {
    reply =
      `عالی، مورد «${task.text}» انجام‌شده ثبت شد.`;
  } else {
    reply =
      "کاری برای تکمیل پیدا نکردم.";
  }
}

// Router
if (!reply && directResponse) {
  reply = directResponse;
}

      if (
  !reply &&
  (
    normalizedText.includes("همون") ||
    normalizedText.includes("همان") ||
    normalizedText.includes("اون") ||
    normalizedText.includes("آن")
  )
) {

  const task =
    resolveLastTask(memory);

  if (task) {

    reply =
      `منظورت احتمالاً «${task.text}» است.`;

  }

      }

// Gemini
if (!reply) {
  const relevantMemory =
    getRelevantMemory(memory, normalizedText);

  try {
    reply = await askGemini(
      env,
      relevantMemory,
      normalizedText
    );
  } catch (err) {
    console.error("Gemini Error:", err);
    reply =
      getFallbackResponse(normalizedText);
  }
}
      memory.shortTermMemory.push(
  `کاربر: ${normalizedText}`
);

memory.shortTermMemory.push(
  `جلال دوم: ${reply}`
);

consolidateMemory(memory);

promoteMemory(memory);

forgettingPolicy(memory);

cleanupMemory(memory);

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
