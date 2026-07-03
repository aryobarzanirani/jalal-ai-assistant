export async function getMemory(env, chatId) {
  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return createDefaultMemory();
  }

  try {
    const parsed = JSON.parse(data);

    return {
      profile: {
        name: parsed.profile?.name || null,
        family: parsed.profile?.family || [],
        preferences: parsed.profile?.preferences || [],
        goals: parsed.profile?.goals || [],
        projects: parsed.profile?.projects || []
      },
      shortTermMemory: parsed.shortTermMemory || [],
      longTermMemory: parsed.longTermMemory || []
    };
  } catch {
    return createDefaultMemory();
  }
}

export async function saveMemory(env, chatId, memory) {
  await env.MEMORY.put(
    chatId,
    JSON.stringify(memory)
  );
}

function createDefaultMemory() {
  return {
    profile: {
      name: null,
      family: [],
      preferences: [],
      goals: [],
      projects: []
    },
    shortTermMemory: [],
    longTermMemory: []
  };
}

function isValidName(name) {
  if (!name) return false;

  const cleaned = name.trim();

  if (cleaned.length < 2 || cleaned.length > 25) {
    return false;
  }

  const badWords = [
    "چیه",
    "چی",
    "کیه",
    "چیست"
  ];

  if (badWords.includes(cleaned)) {
    return false;
  }

  return true;
}

export function rememberName(memory, text) {
  const t = text.trim();

  const patterns = [
    /^اسم من\s+(.+?)\s*(است|هست|ه)?$/i,
    /^من\s+(.+?)\s+هستم$/i
  ];

  for (const pattern of patterns) {
    const match = t.match(pattern);

    if (match) {
      const name = match[1].trim();

      if (isValidName(name)) {
        memory.profile.name = name;
        return;
      }
    }
  }
}

export function rememberFamily(memory, text) {
  if (!memory.profile) {
    memory.profile = {};
  }

  if (!memory.profile.family) {
    memory.profile.family = [];
  }

  if (
    text.includes("اسم دخترم") ||
    text.includes("اسم پسرم") ||
    text.includes("اسم همسرم")
  ) {
    memory.profile.family.push(text);

    if (memory.profile.family.length > 20) {
      memory.profile.family =
        memory.profile.family.slice(-20);
    }
  }
}

export function rememberPreference(memory, text) {
  if (!memory.profile.preferences) {
    memory.profile.preferences = [];
  }

  const triggers = [
    "دوست دارم",
    "علاقه دارم",
    "علاقه‌مندم"
  ];

  for (const trigger of triggers) {
    if (text.includes(trigger)) {
      memory.profile.preferences.push(text);

      if (memory.profile.preferences.length > 20) {
        memory.profile.preferences =
          memory.profile.preferences.slice(-20);
      }

      return;
    }
  }
}

export function rememberGoal(memory, text) {
  if (!memory.profile.goals) {
    memory.profile.goals = [];
  }

  if (!memory.longTermMemory) {
    memory.longTermMemory = [];
  }

  const triggers = [
    "هدف من",
    "دارم روی",
    "میخوام",
    "پروژه من"
  ];

  for (const trigger of triggers) {
    if (text.includes(trigger)) {
      memory.profile.goals.push(text);
      memory.longTermMemory.push(text);

      if (memory.profile.goals.length > 20) {
        memory.profile.goals =
          memory.profile.goals.slice(-20);
      }

      if (memory.longTermMemory.length > 30) {
        memory.longTermMemory =
          memory.longTermMemory.slice(-30);
      }

      return;
    }
  }
}
