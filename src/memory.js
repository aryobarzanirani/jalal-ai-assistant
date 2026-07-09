export function isQuestion(text) {
  if (!text) return false;

  const t = text.trim();

  const markers = [
    "چیه",
    "چیست",
    "کیه",
    "کیست",
    "کجاست",
    "کجاست",
    "چطور",
    "چگونه",
    "چرا",
    "آیا"
  ];

  if (t.includes("?") || t.includes("؟")) {
    return true;
  }

  return markers.some(word => t.includes(word));
}
function shouldSkipText(text, max = 1000) {
  if (!text) return true;

  const t = String(text)
    .replace(/\u200B/g, "")
    .replace(/\uFEFF/g, "")
    .trim();

  if (!t) return true;
  if (t.length > max) return true;

  if (isMemoryDump(t)) return true;

  return false;
}

export function isMemoryDump(text) {
  if (!text) return false;

  const t = String(text)
    .replace(/\u200B/g, "")
    .replace(/\uFEFF/g, "")
    .trim();

  const dumpMarkers = [
    '"profile"',
    '"shortTermMemory"',
    '"semanticMemory"',
    '"dailyContext"',
    '"relationships"',
    '"longTermMemory"'
  ];

  for (const marker of dumpMarkers) {
    if (t.includes(marker)) return true;
  }

  if (
    t.length > 80 &&
    t.includes("{") &&
    t.includes("}") &&
    t.includes('":')
  ) {
    return true;
  }

  return false;
}

function normalizeText(text) {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[؟?!]/g, "");
}

function alreadyExists(list, text) {
  const normalized = normalizeText(text);

  return (list || []).some(item => {
    if (typeof item === "string") {
      return normalizeText(item) === normalized;
    }

    if (item?.text) {
      return normalizeText(item.text) === normalized;
    }

    return false;
  });
}
function sanitizeMemory(memory) {

  if (!memory) {
    return createDefaultMemory();
  }

  memory.profile ??= {};
  memory.profile.preferences ??= [];
  memory.profile.goals ??= [];

  memory.dailyContext ??= {
    date: null,
    tasks: [],
    events: [],
    mood: null
  };

  memory.relationships ??= [];
  memory.semanticMemory ??= [];
  memory.shortTermMemory ??= [];
  memory.longTermMemory ??= [];
  memory.shortTermMemory =
    (memory.shortTermMemory || []).filter(
      item => !isMemoryDump(item)
    );

  memory.semanticMemory =
    (memory.semanticMemory || []).filter(
      item => !isMemoryDump(item?.text || "")
    );

  memory.longTermMemory =
    (memory.longTermMemory || []).filter(
      item => !isMemoryDump(item)
    );

  memory.profile.preferences =
    (memory.profile?.preferences || []).filter(
      item => !isMemoryDump(item)
    );

  memory.profile.goals =
    (memory.profile?.goals || []).filter(
      item => !isMemoryDump(item)
    );

  memory.dailyContext.tasks =
    (memory.dailyContext?.tasks || []).filter(
      item => !isMemoryDump(item)
    );

  memory.dailyContext.events =
    (memory.dailyContext?.events || []).filter(
      item => !isMemoryDump(item)
    );

  return memory;
}

export async function getMemory(env, chatId) {
  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return createDefaultMemory();
  }

  try {
    const parsed = JSON.parse(data);
    const oldFamily = parsed.profile?.family;

    const memory = {
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
      priorities: parsed.priorities || [],
      semanticMemory: parsed.semanticMemory || [],
    dynamicSynonyms: parsed.dynamicSynonyms || {},
      
      dailyContext: parsed.dailyContext || {
        date: null,
        tasks: [],
        events: [],
        mood: null
      }
    };

    return sanitizeMemory(memory);
  } catch {
    return createDefaultMemory();
  }
}

export async function saveMemory(env, chatId, memory) {
  const cleanMemory = sanitizeMemory(memory);
  await env.MEMORY.put(chatId, JSON.stringify(cleanMemory));
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
    priorities: [],
    semanticMemory: [],
    dynamicSynonyms: {},
    
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
  if (shouldSkipText(text, 200)) return;

  if (isQuestion(text)) {
    return;
  }

  const t = text.trim();

  const patterns = [
    /^اسم من\s+(.+)$/i,
    /^من\s+(.+?)\s+هستم$/i
  ];

  for (const pattern of patterns) {
    const match = t.match(pattern);

    if (!match) continue;

    let name = match[1].trim();

    if (isQuestion(name)) {
      return;
    }

    name = name
      .replace(/(است|هست)$/i, "")
      .trim();

    if (!name) return;

    if (isValidName(name)) {
      memory.profile.name = name;
      return;
    }
  }
}

export function rememberEntity(memory, entity) {
// memory.js

import { alreadyExists } from "./utils.js";

export function rememberEntity(memory, entities) {

  if (!entities) return;

  memory.profile ??= {};
  memory.profile.family ??= {};
  memory.profile.goals ??= [];
  memory.profile.projects ??= [];
  memory.profile.preferences ??= [];
  memory.profile.tasks ??= [];

  // ---------------- Name ----------------

  if (entities.personName) {
    memory.profile.name = entities.personName;
  }

  // ---------------- Family ----------------

  if (entities.relation && entities.personName) {

    switch (entities.relation) {

      case "wife":
        memory.profile.family.wife =
          entities.personName;
        break;

      case "husband":
        memory.profile.family.husband =
          entities.personName;
        break;

      case "daughter":
        memory.profile.family.daughter =
          entities.personName;
        break;

      case "son":
        memory.profile.family.son =
          entities.personName;
        break;

    }

  }

  // ---------------- Goal ----------------

  if (
    entities.goal &&
    !alreadyExists(memory.profile.goals, entities.goal)
  ) {
    memory.profile.goals.push(
      entities.goal
    );
  }

  // ---------------- Project ----------------

  if (
    entities.project &&
    !alreadyExists(memory.profile.projects, entities.project)
  ) {
    memory.profile.projects.push(
      entities.project
    );
  }

  // ---------------- Task ----------------

  if (
    entities.task &&
    !alreadyExists(memory.profile.tasks, entities.task)
  ) {
    memory.profile.tasks.push(
      entities.task
    );
  }

  // ---------------- Schedule ----------------

  if (entities.schedule) {

    memory.schedule ??= [];

    if (
      !alreadyExists(memory.schedule, entities.schedule)
    ) {
      memory.schedule.push(
        entities.schedule
      );
    }

  }

  // ---------------- City ----------------

  if (entities.city) {
    memory.profile.city = entities.city;
  }

  // ---------------- Organization ----------------

  if (entities.organization) {
    memory.profile.organization =
      entities.organization;
  }

  // ---------------- Date ----------------

  if (entities.date) {
    memory.context ??= {};
    memory.context.date =
      entities.date;
  }

  // ---------------- Time ----------------

  if (entities.time) {
    memory.context ??= {};
    memory.context.time =
      entities.time;
  }

}
export function rememberPreference(memory, text) {
  if (shouldSkipText(text, 500)) return;
  if (isQuestion(text)) {
  return;
}
  const triggers = ["دوست دارم", "علاقه دارم", "علاقه‌مندم"];

  for (const trigger of triggers) {
    if (text.includes(trigger)) {

  if (alreadyExists(memory.profile.preferences, text)) {
    return;
  }

  memory.profile.preferences.push(text);
  return;
}
  }
}

export function rememberGoal(memory, text) {
  if (shouldSkipText(text, 500)) return;
  if (isQuestion(text)) {
  return;
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

    if (alreadyExists(memory.profile.goals, t)) {
      return;
    }

    memory.profile.goals.push(t);

    if (!alreadyExists(memory.longTermMemory, t)) {
      memory.longTermMemory.push(t);
    }

    return;
  }
}
}

export function rememberRelationship(memory, text) {
  if (shouldSkipText(text, 500)) return;
  if (isQuestion(text)) {
  return;
}
  const t = text.trim();

  const motherMatch =
    t.match(/^(.+?)\s+مادر\s+(.+?)\s+(است|هست)$/);

  if (motherMatch) {
  const exists = memory.relationships.some(
    rel =>
      rel.from === motherMatch[1].trim() &&
      rel.relation === "mother_of" &&
      rel.to === motherMatch[2].trim()
  );

  if (exists) {
    return;
  }

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
  const exists = memory.relationships.some(
    rel =>
      rel.from === fatherMatch[1].trim() &&
      rel.relation === "father_of" &&
      rel.to === fatherMatch[2].trim()
  );

  if (exists) {
    return;
  }

  memory.relationships.push({
    from: fatherMatch[1].trim(),
    relation: "father_of",
    to: fatherMatch[2].trim()
    });
  }
}

export function rememberSemantic(memory, text) {
export function rememberSemantic(memory, text) {
  if (shouldSkipText(text, 1500)) return;
  if (isQuestion(text)) return;

  const t = text.trim();

  if (!t) return;

  let category = "general";
  let importance = 3;

  if (
    t.includes("دخترم") ||
    t.includes("پسرم") ||
    t.includes("همسرم") ||
    t.includes("زنم") ||
    t.includes("شوهرم")
  ) {
    category = "family";
    importance = 8;
  }

  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان") ||
    t.includes("امروز") ||
    t.includes("فردا")
  ) {
    category = "schedule";
    importance = 6;
  }

  if (
    t.includes("هدف") ||
    t.includes("پروژه")
  ) {
    category = "goal";
    importance = 7;
  }

  if (
    t.includes("باید") ||
    t.includes("مهم")
  ) {
    importance += 2;
  }

  if (importance < 5) return;

  if (alreadyExists(memory.semanticMemory, t)) {
    return;
  }

  memory.semanticMemory ??= [];

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
