import { askGemini } from "./gemini.js";
import {
  getMemory,
  saveMemory,
  rememberName,
  rememberGoal
} from "./memory.js";
import { sendTelegram } from "./telegram.js";
import { checkQuota } from "./quota.js";
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

      const directResponse = getDirectResponse(
        memory,
        userText
      );

      if (directResponse) {
        memory.shortTermMemory.push(
          `کاربر: ${userText}`
        );

        memory.shortTermMemory.push(
          `جلال دوم: ${directResponse}`
        );

        if (memory.shortTermMemory.length > 20) {
          memory.shortTermMemory =
            memory.shortTermMemory.slice(-20);
        }

        await saveMemory(env, chatId, memory);

        await sendTelegram(
          env,
          chatId,
          directResponse
        );

        return new Response("OK");
      }

      const quota = await checkQuota(env);

      if (!quota.allowed) {
        await sendTelegram(
          env,
          chatId,
          quota.warning
        );

        return new
