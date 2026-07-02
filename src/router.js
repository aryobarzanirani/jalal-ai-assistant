export function getDirectResponse(memory, userText) {
  const text = userText.trim();

  if (
    text.includes("اسم من چیه") ||
    text.includes("اسم من چیست")
  ) {
    if (memory?.profile?.name) {
      return `اسم شما ${memory.profile.name} است.`;
    }

    return "نام شما هنوز در حافظه من ثبت نشده است.";
  }

  if (
    text.includes("تو کی هستی")
  ) {
    return "من جلال دوم هستم، دستیار شخصی فارسی شما.";
  }

  if (
    text.includes("وضعیت حافظه")
  ) {
    return [
      "وضعیت حافظه:",
      `نام: ${memory?.profile?.name || "ثبت نشده"}`,
      `حافظه کوتاه‌مدت: ${memory?.shortTermMemory?.length || 0} مورد`,
      `حافظه بلندمدت: ${memory?.longTermMemory?.length || 0} مورد`
    ].join("\n");
  }

  return null;
}
