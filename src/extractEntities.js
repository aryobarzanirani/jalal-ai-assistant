// src/extractEntities.js

export function extractEntities(text) {
  const t = (text || "").trim();

  const entities = {
    relation: null,
    personName: null,
    goal: null,
    project: null,
    task: null,
    city: null,
    schedule: null,
    organization: null,
    date: null,
    time: null
  };

  // ---------------- Family ----------------

  if (
    t.includes("دختر")
  ) {
    entities.relation = "daughter";
  }

  else if (
    t.includes("پسر")
  ) {
    entities.relation = "son";
  }

  else if (
    t.includes("همسر") ||
    t.includes("زن")
  ) {
    entities.relation = "wife";
  }

  else if (
    t.includes("شوهر")
  ) {
    entities.relation = "husband";
  }

  // ---------------- Person Name ----------------

  let match =
    t.match(/^اسم من\s+(.+?)\s*(است|هست)?$/);

  if (!match) {
    match =
      t.match(/^من\s+(.+?)\s+هستم$/);
  }

  if (match) {
    entities.personName = match[1].trim();
  }

  // ---------------- Goal ----------------

  if (
    t.startsWith("هدف من") ||
    t.includes("میخوام") ||
    t.includes("می‌خوام")
  ) {
    entities.goal = t;
  }

  // ---------------- Project ----------------

  if (
    t.includes("پروژه") ||
    t.includes("در حال ساخت") ||
    t.includes("در حال توسعه")
  ) {
    entities.project = t;
  }

  // ---------------- Task ----------------

  if (
    t.includes("باید") ||
    t.includes("لازمه")
  ) {
    entities.task = t;
  }

  // ---------------- Schedule ----------------

  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان")
  ) {
    entities.schedule = t;
  }

  // ---------------- Date ----------------

  const dateWords = [
    "امروز",
    "فردا",
    "پس‌فردا",
    "دیشب",
    "دیروز"
  ];

  for (const word of dateWords) {
    if (t.includes(word)) {
      entities.date = word;
      break;
    }
  }

  // ---------------- Time ----------------

  const timeWords = [
    "صبح",
    "ظهر",
    "عصر",
    "شب"
  ];

  for (const word of timeWords) {
    if (t.includes(word)) {
      entities.time = word;
      break;
    }
  }

  // ---------------- Cities ----------------

  const cities = [
    "تهران",
    "یزد",
    "مشهد",
    "تبریز",
    "اصفهان",
    "شیراز",
    "قم",
    "کرج",
    "رشت",
    "اهواز"
  ];

  for (const city of cities) {
    if (t.includes(city)) {
      entities.city = city;
      break;
    }
  }

  // ---------------- Organization ----------------

  if (
    t.includes("بیمارستان")
  ) {
    entities.organization = "بیمارستان";
  }

  return entities;
}
