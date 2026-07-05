export function extractEntities(memory, text) {
  if (!memory.entities) {
    memory.entities = {
      people: [],
      places: [],
      projects: []
    };
  }

  const peopleCandidates = [];
  const placeKeywords = [
    "استخر",
    "خانه",
    "مدرسه",
    "پارک",
    "بیمارستان",
    "شرکت",
    "دفتر"
  ];

  // Family-based people extraction
  const family = memory?.profile?.family || {};

  if (family.wife) peopleCandidates.push(family.wife);
  if (family.husband) peopleCandidates.push(family.husband);
  if (family.daughter) peopleCandidates.push(family.daughter);
  if (family.son) peopleCandidates.push(family.son);

  for (const person of peopleCandidates) {
    if (
      person &&
      text.includes(person) &&
      !memory.entities.people.includes(person)
    ) {
      memory.entities.people.push(person);
    }
  }

  for (const place of placeKeywords) {
    if (
      text.includes(place) &&
      !memory.entities.places.includes(place)
    ) {
      memory.entities.places.push(place);
    }
  }

  const projectKeywords = [
    "پروژه",
    "اپلیکیشن",
    "ربات",
    "هوش مصنوعی"
  ];

  for (const keyword of projectKeywords) {
    if (
      text.includes(keyword) &&
      !memory.entities.projects.includes(text)
    ) {
      memory.entities.projects.push(text);
      break;
    }
  }
}
