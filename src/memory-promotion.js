function shouldPromote(item) {

  if (!item) {
    return false;
  }

  const text =
    typeof item === "string"
      ? item
      : item.text;

  if (!text) {
    return false;
  }

  const keywords = [
    "اسم من",
    "اسم دخترم",
    "اسم پسرم",
    "اسم همسرم",
    "هدف من",
    "میخوام",
    "می‌خوام",
    "دوست دارم",
    "علاقه دارم",
    "شغل",
    "کار",
    "پزشک",
    "بیمارستان"
  ];

  return keywords.some(
    keyword => text.includes(keyword)
  );
}

export function promoteMemory(memory) {

  if (!memory.longTermMemory) {
    memory.longTermMemory = [];
  }

  for (const item of memory.shortTermMemory || []) {

    if (!shouldPromote(item)) {
      continue;
    }

    if (
      !memory.longTermMemory.includes(item)
    ) {
      memory.longTermMemory.push(item);
    }
  }

  if (memory.longTermMemory.length > 100) {
    memory.longTermMemory =
      memory.longTermMemory.slice(-100);
  }
}
