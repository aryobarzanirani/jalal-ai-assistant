export async function getMemory(env, chatId) {
  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return createDefaultMemory();
  }

  try {
    const parsed = JSON.parse(data);
    const oldFamily = parsed.profile?.family;

    return {
      profile: {
        name: parsed.profile?.name || null,

        family: Array.isArray(oldFamily)
          ? {
              wife: null,
              husband: null,
              daughter: null,
              son: null
            }
          : {
              wife: oldFamily?.wife || null,
              husband: oldFamily?.husband || null,
              daughter: oldFamily?.daughter || null,
              son: oldFamily?.son || null
            },

        preferences: parsed.profile?.preferences || [],
        goals: parsed.profile?.goals || [],
        projects: parsed.profile?.projects || []
      },

      entities: parsed.entities || {
        people: [],
        places: [],
        projects: []
      },

      shortTermMemory: parsed.shortTermMemory || [],
      longTermMemory: parsed.longTermMemory || [],
      relationships: parsed.relationships || [],

      dailyContext: parsed.dailyContext || {
        date: null,
        tasks: [],
        events: [],
        mood: null
      }
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

      family: {
        wife: null,
        husband: null,
        daughter: null,
        son: null
      },

      preferences: [],
      goals: [],
      projects: []
    },

    entities: {
      people: [],
      places: [],
      projects: []
    },

    shortTermMemory: [],
    longTermMemory: [],
    relationships: [],

    dailyContext: {
      date: null,
      tasks: [],
      events: [],
      mood: null
    }
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
  if (!memory.profile.family) {
    memory.profile.family = {
      wife: null,
      husband: null,
      daughter: null,
      son: null
    };
  }

  const t = text.trim();
  let match;

  match = t.match(/اسم دخترم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.daughter = match[1].trim();
    return;
  }

  match = t.match(/اسم پسرم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.son = match[1].trim();
    return;
  }

  match = t.match(/
