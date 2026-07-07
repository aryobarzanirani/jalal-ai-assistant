export function getDirectResponse(
  memory,
  userText,
  intent,
  entities = {}
) {
  switch (intent) {

    // ---------------- Greeting ----------------

    case "greeting": {
      const name = memory?.profile?.name;

      return name
        ? `سلام ${name}.`
        : "سلام. خوشحالم که برگشتی.";
    }

    // ---------------- Bot ----------------

    case "bot_identity":
      return "اسم من جلال دوم است.";

    // ---------------- User ----------------

    case "user_name":
      return memory?.profile?.name
        ? `نام شما ${memory.profile.name} است.`
        : "هنوز نام شما را نمی‌دانم.";

    // ---------------- Family ----------------

    case "family":

      switch (entities.family) {

        case "daughter":
          return memory?.profile?.family?.daughter
            ? `نام دختر شما ${memory.profile.family.daughter} است.`
            : "نام دختر شما در حافظه ثبت نشده است.";

        case "son":
          return memory?.profile?.family?.son
            ? `نام پسر شما ${memory.profile.family.son} است.`
            : "نام پسر شما در حافظه ثبت نشده است.";

        case "wife":
          return memory?.profile?.family?.wife
            ? `نام همسر شما ${memory.profile.family.wife} است.`
            : "نام همسر شما در حافظه ثبت نشده است.";

        case "husband":
          return memory?.profile?.family?.husband
            ? `نام همسر شما ${memory.profile.family.husband} است.`
            : "نام همسر شما در حافظه ثبت نشده است.";

        default:
          return null;
      }

    // ---------------- Preferences ----------------

    case "preferences": {

      const preferences =
        memory?.profile?.preferences || [];

      if (!preferences.length) {
        return "هنوز علاقه‌ای از شما ثبت نشده است.";
      }

      return [
        "علایق ثبت‌شده شما:",
        ...preferences.slice(-5)
      ].join("\n");
    }

    // ---------------- Goal ----------------

    case "goal": {

      const goals =
        memory?.profile?.goals || [];

      if (!goals.length) {
        return "هدفی از شما در حافظه ثبت نشده است.";
      }

      if (entities.goal === "project") {
        return `پروژه شما ${goals.at(-1)} است.`;
      }

      return goals.at(-1);
    }

    // ---------------- Schedule ----------------

    case "schedule":
      return "متوجه شدم، ثبت شد.";

    // ---------------- Task ----------------

    case "task":
      return "متوجه شدم، این مورد را در برنامه‌ات نگه می‌دارم.";

    // ---------------- Memory ----------------

    case "memory_status": {

      const family =
        memory?.profile?.family || {};

      const familyCount =
        Number(!!family.wife) +
        Number(!!family.husband) +
        Number(!!family.daughter) +
        Number(!!family.son);

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

    // ---------------- Small Talk ----------------

    case "smalltalk":
      return "خوبم. آماده‌ام کمکت کنم.";

    case "presence":
      return "بله، در خدمتم.";

    default:
      return null;
  }
                }
