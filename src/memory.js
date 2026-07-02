export async function getMemory(env, chatId) {
  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return createDefaultMemory();
  }

  try {
    const parsed = JSON.parse(data);

    // Migration from old schema
    if ("history" in parsed || "name" in parsed) {
      return {
        profile: {
          name: parsed.name || null,
          preferences: [],
          goals: []
        },
        shortTermMemory: Array.isArray(parsed.history)
          ? parsed.history
          : [],
        longTermMemory: []
      };
    }

    return {
      profile: {
        name: parsed?.profile?.name || null,
        preferences: Array.isArray(parsed?.profile?.preferences)
          ? parsed.profile.preferences
          : [],
        goals: Array.isArray(parsed?.profile?.goals)
          ? parsed.profile.goals
          : []
      },
      shortTermMemory: Array.isArray(parsed?.shortTermMemory)
        ? parsed.shortTermMemory
        : [],
      longTermMemory: Array.isArray(parsed?.longTermMemory)
        ? parsed.longTermMemory
        : []
    };
  } catch (err) {
    console.error("Memory Parse Error:", err);
    return createDefaultMemory();
  }
}

export async function saveMemory(env, chatId, memory) {
  await env.MEMORY.put(chatId, JSON.stringify(memory));
}

function createDefaultMemory() {
  return {
    profile: {
      name: null,
      preferences: [],
      goals: []
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

  const badWords = ["چیه", "چی", "کیه"];

  return !badWords.includes(cleaned);
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

export function rememberGoal(memory, text) {
  if (!Array.isArray(memory.longTermMemory)) {
    memory.longTermMemory = [];
  }

  const triggers = ["هدف من", "دارم روی", "میخوام"];

  for (const trigger of triggers) {
    if (text.includes(trigger)) {
      memory.longTermMemory.push(text);

      if (memory.longTermMemory.length > 30) {
        memory.longTermMemory =
          memory.longTermMemory.slice(-30);
      }

      return;
    }
  }
}
