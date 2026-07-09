import { alreadyExists } from "./utils.js";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

export function isQuestion(text) {
  if (!text) return false;

  const t = text.trim();

  const markers = [
    "چیه",
    "چیست",
    "کیه",
    "کیست",
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
    if (t.includes(marker)) {
      return true;
    }
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

// --------------------------------------------------
// Default Memory
// --------------------------------------------------

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
      projects: [],
      tasks: [],

      city: null,
      organization: null

    },

    entities: {
      people: [],
      places: [],
      projects: []
    },

    schedule: [],

    context: {
      date: null,
      time: null
    },

    dailyContext: {
      date: null,
      tasks: [],
      events: [],
      mood: null
    },

    relationships: [],

    semanticMemory: [],
    shortTermMemory: [],
    longTermMemory: [],

    priorities: [],

    dynamicSynonyms: {}

  };

}

// --------------------------------------------------
// Sanitizer
// --------------------------------------------------

function sanitizeMemory(memory) {

  if (!memory) {
    return createDefaultMemory();
  }

  memory.profile ??= {};

  memory.profile.family ??= {};

  memory.profile.preferences ??= [];

  memory.profile.goals ??= [];

  memory.profile.projects ??= [];

  memory.profile.tasks ??= [];

  memory.schedule ??= [];

  memory.context ??= {
    date: null,
    time: null
  };

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

  memory.priorities ??= [];

  memory.dynamicSynonyms ??= {};

  return memory;
}
// --------------------------------------------------
// Load / Save Memory
// --------------------------------------------------

export async function getMemory(env, chatId) {

  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return createDefaultMemory();
  }

  try {

    const memory = JSON.parse(data);

    return sanitizeMemory(memory);

  } catch {

    return createDefaultMemory();

  }

}

export async function saveMemory(env, chatId, memory) {

  const cleanMemory =
    sanitizeMemory(memory);

  await env.MEMORY.put(
    chatId,
    JSON.stringify(cleanMemory)
  );

}

// --------------------------------------------------
// Entity Memory
// --------------------------------------------------

export function rememberEntity(memory, entities) {

  if (!entities) return;

  memory.profile ??= {};
  memory.profile.family ??= {};
  memory.profile.preferences ??= [];
  memory.profile.goals ??= [];
  memory.profile.projects ??= [];
  memory.profile.tasks ??= [];

  // ---------- Name ----------

  if (entities.personName) {

    memory.profile.name =
      entities.personName;

  }

  // ---------- Family ----------

  if (
    entities.relation &&
    entities.personName
  ) {

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

  // ---------- Goals ----------

  if (
    entities.goal &&
    !alreadyExists(
      memory.profile.goals,
      entities.goal
    )
  ) {

    memory.profile.goals.push(
      entities.goal
    );

  }

  // ---------- Projects ----------

  if (
    entities.project &&
    !alreadyExists(
      memory.profile.projects,
      entities.project
    )
  ) {

    memory.profile.projects.push(
      entities.project
    );

  }

  // ---------- Tasks ----------

  if (
    entities.task &&
    !alreadyExists(
      memory.profile.tasks,
      entities.task
    )
  ) {

    memory.profile.tasks.push(
      entities.task
    );

  }

  // ---------- Schedule ----------

  if (entities.schedule) {

    memory.schedule ??= [];

    if (
      !alreadyExists(
        memory.schedule,
        entities.schedule
      )
    ) {

      memory.schedule.push(
        entities.schedule
      );

    }

  }

  // ---------- City ----------

  if (entities.city) {

    memory.profile.city =
      entities.city;

  }

  // ---------- Organization ----------

  if (entities.organization) {

    memory.profile.organization =
      entities.organization;

  }

  // ---------- Context ----------

  memory.context ??= {
    date: null,
    time: null
  };

  if (entities.date) {

    memory.context.date =
      entities.date;

  }

  if (entities.time) {

    memory.context.time =
      entities.time;

  }

}
// --------------------------------------------------
// Remember Name
// --------------------------------------------------

export function rememberName(memory, text) {

  if (shouldSkipText(text, 200)) return;

  if (isQuestion(text)) return;

  const match =
    text.match(/^اسم من\s+(.+?)(\s+است|\s+هست)?$/);

  if (!match) return;

  const name = match[1].trim();

  if (name) {
    memory.profile.name = name;
  }

}

// --------------------------------------------------
// Remember Preference
// --------------------------------------------------

export function rememberPreference(memory, text) {

  if (shouldSkipText(text, 500)) return;

  if (isQuestion(text)) return;

  const triggers = [
    "دوست دارم",
    "علاقه دارم",
    "علاقه‌مندم"
  ];

  if (!triggers.some(t => text.includes(t))) {
    return;
  }

  memory.profile.preferences ??= [];

  if (
    !alreadyExists(
      memory.profile.preferences,
      text
    )
  ) {
    memory.profile.preferences.push(text);
  }

}

// --------------------------------------------------
// Remember Goal
// --------------------------------------------------

export function rememberGoal(memory, text) {

  if (shouldSkipText(text, 500)) return;

  if (isQuestion(text)) return;

  const triggers = [
    "هدف من",
    "میخوام",
    "می‌خوام",
    "در حال ساخت",
    "در حال توسعه",
    "پروژه"
  ];

  if (!triggers.some(t => text.includes(t))) {
    return;
  }

  memory.profile.goals ??= [];

  if (
    !alreadyExists(
      memory.profile.goals,
      text
    )
  ) {

    memory.profile.goals.push(text);

  }

}

// --------------------------------------------------
// Remember Relationship
// --------------------------------------------------

export function rememberRelationship(memory, text) {

  if (shouldSkipText(text, 500)) return;

  if (isQuestion(text)) return;

  memory.relationships ??= [];

  const mother =
    text.match(/^(.+?)\s+مادر\s+(.+?)\s+(است|هست)$/);

  if (mother) {

    memory.relationships.push({

      from: mother[1].trim(),

      relation: "mother_of",

      to: mother[2].trim()

    });

    return;

  }

  const father =
    text.match(/^(.+?)\s+پدر\s+(.+?)\s+(است|هست)$/);

  if (father) {

    memory.relationships.push({

      from: father[1].trim(),

      relation: "father_of",

      to: father[2].trim()

    });

  }

}
// --------------------------------------------------
// Remember Semantic Memory
// --------------------------------------------------

export function rememberSemantic(memory, text) {

  if (shouldSkipText(text, 1500)) return;

  if (isQuestion(text)) return;

  const t = text.trim();

  if (!t) return;

  memory.semanticMemory ??= [];

  let category = "general";
  let importance = 3;

  // ---------- Family ----------

  if (
    t.includes("دختر") ||
    t.includes("پسر") ||
    t.includes("همسر") ||
    t.includes("زن") ||
    t.includes("شوهر")
  ) {
    category = "family";
    importance = 8;
  }

  // ---------- Goal ----------

  if (
    t.includes("هدف") ||
    t.includes("پروژه") ||
    t.includes("در حال ساخت") ||
    t.includes("در حال توسعه")
  ) {
    category = "goal";
    importance = 7;
  }

  // ---------- Schedule ----------

  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان") ||
    t.includes("امروز") ||
    t.includes("فردا")
  ) {
    category = "schedule";
    importance = 6;
  }

  // ---------- Important ----------

  if (
    t.includes("باید") ||
    t.includes("مهم")
  ) {
    importance += 2;
  }

  if (importance < 5) {
    return;
  }

  if (
    alreadyExists(memory.semanticMemory, t)
  ) {
    return;
  }

  memory.semanticMemory.push({

    text: t,

    category,

    importance,

    timestamp: new Date()
      .toISOString()
      .slice(0,10)

  });

  if (
    memory.semanticMemory.length > 100
  ) {
    memory.semanticMemory =
      memory.semanticMemory.slice(-100);
  }

}
