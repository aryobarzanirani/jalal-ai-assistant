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
    text.includes("اسم دخترم چیه") ||
    text.includes("اسم دخترم چیست")
  ) {
    const family = memory?.profile?.family || [];

    const daughter = family.find(item =>
      item.includes("اسم دخترم")
    );

    if (daughter) {
      return daughter;
    }

    return "اطلاعاتی درباره دختر شما در حافظه ثبت نشده است.";
  }

  if (
    text.includes("علایق من چیه") ||
    text.includes("به چی علاقه دارم")
  ) {
    const preferences =
      memory?.profile?.preferences || [];

    if (preferences.length) {
      return [
        "علایق ثبت‌شده شما:",
        ...preferences.slice(-5)
      ].join("\n");
    }

    return "هنوز علاقه‌ای از شما ثبت نشده است.";
  }

  if (
    text.includes("روی چه پروژه‌ای کار می‌کنم") ||
    text.includes("پروژه من چیه")
  ) {
    const goals = memory?.profile?.goals || [];

    if (goals.length) {
      return [
        "پروژه‌ها / اهداف ثبت‌شده:",
        ...goals.slice(-5)
      ].join("\n");
    }

    return "هنوز پروژه‌ای در حافظه ثبت نشده است.";
  }

  if (
    text.includes("وضعیت حافظه")
  ) {
    return [
      "وضعیت حافظه:",
      `نام: ${memory?.profile?.name || "ثبت نشده"}`,
      `خانواده: ${memory?.profile?.family?.length || 0}`,
      `علایق: ${memory?.profile?.preferences?.length || 0}`,
      `اهداف: ${memory?.profile?.goals?.length || 0}`,
      `حافظه کوتاه‌مدت: ${memory?.shortTermMemory?.length || 0}`,
      `حافظه بلندمدت: ${memory?.longTermMemory?.length || 0}`
    ].join("\n");
  }

  return null;
}
