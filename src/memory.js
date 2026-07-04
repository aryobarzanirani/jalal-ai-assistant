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

        preferences:
          parsed.profile?.preferences || [],

        goals:
          parsed.profile?.goals || [],

        projects:
          parsed.profile?.projects || []
      },

      entities: {
  people: [],
  places: [],
 projects: []
},

      shortTermMemory:
        parsed.shortTermMemory || [],

      longTermMemory:
        parsed.longTermMemory || []
      relationships: parsed.relationships || []
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

    entities: parsed.entities || {
  people: [],
  places: [],
  projects: []
},
      
    shortTermMemory: [],
    longTermMemory: []
    relationships: []
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
    memory.profile.family.daughter =
      match[1].trim();
    return;
  }

  match = t.match(/اسم پسرم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.son =
      match[1].trim();
    return;
  }

  match = t.match(/اسم همسرم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.wife =
      match[1].trim();
    return;
  }

  match = t.match(/اسم زنم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.wife =
      match[1].trim();
    return;
  }

  match = t.match(/اسم شوهرم\s+(.+?)\s*(است|هست|ه)?$/);
  if (match) {
    memory.profile.family.husband =
      match[1].trim();
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

  const t = text.trim();

  if (
    t.includes("چیه") ||
    t.includes("چیست") ||
    t.includes("?") ||
    t.includes("؟")
  ) {
    return;
  }

  const triggers = [
    "هدف من",
    "دارم روی",
    "میخوام",
    "می‌خوام",
    "در حال ساخت",
    "در حال توسعه"
  ];

  for (const trigger of triggers) {
    if (t.includes(trigger)) {
      memory.profile.goals.push(t);
      memory.longTermMemory.push(t);

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
