export function rememberSemantic(memory, text) {
  if (!memory.semanticMemory) {
    memory.semanticMemory = [];
  }

  const t = text.trim();

  let category = "general";
  let importance = 3;

  if (
    t.includes("دخترم") ||
    t.includes("پسرم") ||
    t.includes("همسرم")
  ) {
    category = "family";
    importance = 8;
  }

  if (
    t.includes("کار") ||
    t.includes("شیفت")
  ) {
    category = "work";
    importance = 6;
  }

  if (
    t.includes("باید") ||
    t.includes("مهم")
  ) {
    importance += 1;
  }

  if (importance < 5) {
    return;
  }

  memory.semanticMemory.push({
    text: t,
    category,
    importance,
    timestamp: new Date()
      .toISOString()
      .slice(0, 10)
  });

  if (memory.semanticMemory.length > 100) {
    memory.semanticMemory =
      memory.semanticMemory.slice(-100);
  }
}
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

      semanticMemory: parsed.semanticMemory || []
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
  await env.MEMORY.put(chatId, JSON.stringify(memory));
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

      semanticMemory: []
        
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

  const badWords = ["چیه", "چی", "کیه", "چیست"];

  if (badWords.includes(cleaned)) {
    return false;
  }

  return true;
}

export function rememberName(memory, text) {
  const t = text.trim();

  const patterns = [
    /^اسم من\s+(.+)$/i,
    /^من\s+(.+?)\s+هستم$/i
  ];

  for (const pattern of patterns) {
    const match = t.match(pattern);

    if (match) {
      let name = match[1].trim();

      name = name
        .replace(/(است|هست)$/,"")
        .replace(/ه$/,"")
        .trim();

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

  const patterns = [
    { key: "daughter", regex: /^اسم دخترم\s+(.+)$/i },
    { key: "son", regex: /^اسم پسرم\s+(.+)$/i },
    { key: "wife", regex: /^اسم همسرم\s+(.+)$/i },
    { key: "wife", regex: /^اسم زنم\s+(.+)$/i },
    { key: "husband", regex: /^اسم شوهرم\s+(.+)$/i }
  ];

  for (const item of patterns) {
    const match = t.match(item.regex);

    if (match) {
      let name = match[1].trim();

      name = name
        .replace(/(است|هست)$/,"")
        .trim();

      memory.profile.family[item.key] = name;
      return;
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

export function rememberRelationship(memory, text) {
  if (!memory.relationships) {
    memory.relationships = [];
  }

  const t = text.trim();

  const motherMatch =
    t.match(/^(.+?)\s+مادر\s+(.+?)\s+(است|هست)$/);

  if (motherMatch) {
    memory.relationships.push({
      from: motherMatch[1].trim(),
      relation: "mother_of",
      to: motherMatch[2].trim()
    });
    return;
  }

  const fatherMatch =
    t.match(/^(.+?)\s+پدر\s+(.+?)\s+(است|هست)$/);

  if (fatherMatch) {
    memory.relationships.push({
      from: fatherMatch[1].trim(),
      relation: "father_of",
      to: fatherMatch[2].trim()
    });
  }
    }
