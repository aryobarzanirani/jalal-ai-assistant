// src/router.js
import { cleanText } from "./utils.js";

export function getDirectResponse(memory, userText) {
  const text = cleanText(userText).toLowerCase();

  // Greeting
  if (["سلام", "سلام جلال", "صبح بخیر", "شب بخیر"].includes(cleanText(userText))) {
    const name = memory?.profile?.name;
    return name ? `سلام ${name} جان.` : "سلام. خوشحالم که برگشتی.";
  }

  // Small Talk
  if (text.includes("خوبی") || text.includes("چطوری") || text.includes("حالت")) {
    return "خوبم، ممنون. آماده‌ام کمکت کنم 🔥";
  }

  if (["هستی؟", "هستی", "آنجایی؟"].includes(cleanText(userText))) {
    return "بله، همیشه در خدمتم.";
  }

  // Identity
  if (text.includes("تو کی هستی") || text.includes("اسمت چیه") || text.includes("اسم تو")) {
    return "اسم من **جلال دوم** است. دستیار شخصی اختصاصی تو.";
  }

  // Memory Status
  if (text.includes("وضعیت حافظه") || text.includes("حافظه چطوره")) {
    const p = memory?.profile || {};
    const f = p.family || {};

    let familyCount = [f.wife, f.husband, f.daughter, f.son].filter(Boolean).length;

    return `**وضعیت حافظه:**
• نام: ${p.name || "ثبت نشده"}
• خانواده: ${familyCount} نفر
• علایق: ${p.preferences?.length || 0}
• اهداف: ${p.goals?.length || 0}
• حافظه کوتاه‌مدت: ${memory?.shortTermMemory?.length || 0}
• حافظه معنایی: ${memory?.semanticMemory?.length || 0}`;
  }

  // Preferences
  if (text.includes("علایق من") || text.includes("به چی علاقه")) {
    const prefs = memory?.profile?.preferences || [];
    return prefs.length 
      ? `علایق ثبت شده تو:\n${prefs.slice(-6).join("\n")}` 
      : "هنوز علایقی ثبت نشده.";
  }

  // Goals
  if (text.includes("هدف من") || text.includes("پروژه من")) {
    const goals = memory?.profile?.goals || [];
    return goals.length 
      ? `آخرین هدف ثبت شده: ${goals[goals.length-1]}` 
      : "هنوز هدفی ثبت نشده.";
  }

  // Family quick recall
  if (text.includes("دخترم") && memory?.profile?.family?.daughter) {
    return `دخترت ${memory.profile.family.daughter} هست.`;
  }
  if ((text.includes("همسرم") || text.includes("زنم")) && memory?.profile?.family?.wife) {
    return `همسرت ${memory.profile.family.wife} هست.`;
  }

  // Default
  return null;
}
