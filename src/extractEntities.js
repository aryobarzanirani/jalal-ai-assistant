// src/extractEntities.js

export function extractEntities(text) {

  const t = (text || "").trim();

  const entities = [];

  // ---------------- Name ----------------

  let match =
    t.match(/^اسم من\s+(.+?)\s*(است|هست)?$/);

  if (!match) {
    match =
      t.match(/^من\s+(.+?)\s+هستم$/);
  }

  if (match) {
    entities.push({
      type: "name",
      value: match[1].trim()
    });
  }

  // ---------------- Wife ----------------

  match =
    t.match(/(?:اسم\s+)?(?:همسر|زن)م\s+(.+)/);

  if (match) {
    entities.push({
      type: "wife",
      value: match[1].trim()
    });
  }

  // ---------------- Husband ----------------

  match =
    t.match(/(?:اسم\s+)?شوهرم\s+(.+)/);

  if (match) {
    entities.push({
      type: "husband",
      value: match[1].trim()
    });
  }

  // ---------------- Daughter ----------------

  match =
    t.match(/(?:اسم\s+)?دخترم\s+(.+)/);

  if (match) {
    entities.push({
      type: "daughter",
      value: match[1].trim()
    });
  }

  // ---------------- Son ----------------

  match =
    t.match(/(?:اسم\s+)?پسرم\s+(.+)/);

  if (match) {
    entities.push({
      type: "son",
      value: match[1].trim()
    });
  }

  // ---------------- Goal ----------------

  if (
    t.startsWith("هدف من") ||
    t.includes("میخوام") ||
    t.includes("می‌خوام")
  ) {

    entities.push({
      type: "goal",
      value: t
    });

  }

  // ---------------- Preference ----------------

  if (
    t.includes("دوست دارم") ||
    t.includes("علاقه دارم") ||
    t.includes("عاشق")
  ) {

    entities.push({
      type: "preference",
      value: t
    });

  }

  // ---------------- Project ----------------

  if (
    t.includes("پروژه") ||
    t.includes("در حال توسعه") ||
    t.includes("در حال ساخت")
  ) {

    entities.push({
      type: "goal",
      value: t
    });

  }

  // ---------------- Task ----------------

  if (
    t.includes("باید") ||
    t.includes("لازمه")
  ) {

    entities.push({
      type: "task",
      value: t
    });

  }

  // ---------------- Schedule ----------------

  if (
    t.includes("شیفت") ||
    t.includes("بیمارستان")
  ) {

    entities.push({
      type: "schedule",
      value: t
    });

  }

  // ---------------- City ----------------

  const cities = [
    "تهران",
    "مشهد",
    "اصفهان",
    "شیراز",
    "تبریز",
    "یزد",
    "قم",
    "کرج",
    "رشت",
    "اهواز"
  ];

  for (const city of cities) {

    if (t.includes(city)) {

      entities.push({
        type: "city",
        value: city
      });

      break;
    }

  }

  // ---------------- Date ----------------

  const dates = [
    "امروز",
    "فردا",
    "پس‌فردا",
    "دیروز",
    "دیشب"
  ];

  for (const date of dates) {

    if (t.includes(date)) {

      entities.push({
        type: "date",
        value: date
      });

      break;
    }

  }

  // ---------------- Time ----------------

  const times = [
    "صبح",
    "ظهر",
    "عصر",
    "شب"
  ];

  for (const time of times) {

    if (t.includes(time)) {

      entities.push({
        type: "time",
        value: time
      });

      break;
    }

  }

  return entities;

      }
