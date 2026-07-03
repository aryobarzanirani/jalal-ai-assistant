export function getDirectResponse(memory, userText) {
  const text = userText.trim();

  // Greeting
  if (
    text === "سلام" ||
    text === "سلام جلال" ||
    text === "صبح بخیر" ||
    text === "شب بخیر"
  ) {
    const name = memory?.profile?.name;

    if (name) {
      return `سلام ${name}.`;
    }

    return "سلام. خوشحالم که برگشتی.";
  }

  // Small Talk
  if (
    text.includes("خوبی") ||
    text.includes("چطوری")
  ) {
    return "خوبم. آماده‌ام کمکت کنم.";
  }

  if (
    text.includes("هستی")
  ) {
    return "بله، در خدمتم.";
  }

  // Identity
  if (
    text.includes("تو کی هستی")
  text.includes("اسم تو چیه") ||
  text.includes("اسم شما چیه") ||
  text.includes("اسمت چیه")
) {
  return "اسم من جلال دوم است.";
  }
  ) {
    return "من جلال دوم هستم، دستیار شخصی فارسی شما.";
  }

  if (
    text.includes("اسم من چیه") ||
    text.includes("اسم من چیست")
  ) {
    if (memory?.profile?.name) {
      return `اسم شما ${memory.profile.name} است.`;
    }

    return "نام شما هنوز در حافظه من ثبت نشده است.";
  }

  // Family
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

  // Preferences
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

  // Goals / Projects
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

  // Memory Status
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
