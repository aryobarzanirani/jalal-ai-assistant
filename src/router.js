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
  text === "هستی؟" ||
  text === "هستی" ||
  text === "آنجایی؟"
) {
  return "بله، در خدمتم.";
}

  // Identity
  if (
    text.includes("تو کی هستی") ||
    text.includes("اسم تو چیه") ||
    text.includes("اسم شما چیه") ||
    text.includes("اسمت چیه")
  ) {
    return "اسم من جلال دوم است.";
  }

  // User Name
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
  const daughter = memory?.profile?.family?.daughter;

  if (daughter) {
    return `نام دختر شما ${daughter} است.`;
  }

  return "نام دختر شما در حافظه ثبت نشده است.";
}

  // Wife
if (
  text.includes("اسم همسرم چیه") ||
  text.includes("اسم همسرم چیست") ||
  text.includes("اسم زنم چیه")
) {
  const wife = memory?.profile?.family?.wife;

  if (wife) {
    return `نام همسر شما ${wife} است.`;
  }

  return "نام همسر شما در حافظه ثبت نشده است.";
}

// Husband
if (
  text.includes("اسم شوهرم چیه") ||
  text.includes("اسم شوهرم چیست")
) {
  const husband = memory?.profile?.family?.husband;

  if (husband) {
    return `نام همسر شما ${husband} است.`;
  }

  return "نام همسر شما در حافظه ثبت نشده است.";
}

// Son
if (
  text.includes("اسم پسرم چیه") ||
  text.includes("اسم پسرم چیست")
) {
  const son = memory?.profile?.family?.son;

  if (son) {
    return `نام پسر شما ${son} است.`;
  }

  return "نام پسر شما در حافظه ثبت نشده است.";
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

  // Goals
  if (
    text.includes("روی چه پروژه‌ای کار می‌کنم") ||
    text.includes("پروژه من چیه")
  ) {
    const goals =
      memory?.profile?.goals || [];

    if (goals.length) {
      return `پروژه شما ${goals[goals.length - 1]} است.`;
    }

    return "هنوز پروژه‌ای ثبت نشده است.";
  }
if (
  text.includes("هدف من چیه") ||
  text.includes("هدف من چیست")
) {
  const goals = memory?.profile?.goals || [];

  if (goals.length) {
    return goals[goals.length - 1];
  }

  return "هدفی از شما در حافظه ثبت نشده است.";
}

  // Memory Status
  if (text.includes("وضعیت حافظه")) {
    const family =
      memory?.profile?.family || {};

    let familyCount = 0;

    if (family.wife) familyCount++;
    if (family.husband) familyCount++;
    if (family.daughter) familyCount++;
    if (family.son) familyCount++;

    return [
      "وضعیت حافظه:",
      `نام: ${memory?.profile?.name || "ثبت نشده"}`,
      `خانواده: ${familyCount}`,
      `علایق: ${memory?.profile?.preferences?.length || 0}`,
      `اهداف: ${memory?.profile?.goals?.length || 0}`,
      `حافظه کوتاه‌مدت: ${memory?.shortTermMemory?.length || 0}`,
      `حافظه بلندمدت: ${memory?.longTermMemory?.length || 0}`
    ].join("\n");
  }

  return null;
                         }
