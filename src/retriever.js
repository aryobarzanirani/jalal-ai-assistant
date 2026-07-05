import { similarity } from "./search-utils.js";

export function getRelevantMemory(memory, userText) {

  const text = userText.trim();

  const relevant = {
    profile: {},
    shortTermMemory:
      memory.shortTermMemory?.slice(-8) || [],
    longTermMemory: [],
    semanticMemory: [],
    priorities: []
  };

  // Family
  if (
    text.includes("دختر") ||
    text.includes("پسر") ||
    text.includes("همسر") ||
    text.includes("زن")
  ) {
    relevant.profile.family =
      memory.profile?.family || {};
  }

  // Preferences
  if (
    text.includes("علاقه") ||
    text.includes("دوست دارم")
  ) {
    relevant.profile.preferences =
      memory.profile?.preferences || [];
  }

  // Goals
  if (
    text.includes("پروژه") ||
    text.includes("هدف") ||
    text.includes("کار")
  ) {
    relevant.profile.goals =
      memory.profile?.goals || [];
  }

  // Name
  if (text.includes("اسم")) {
    relevant.profile.name =
      memory.profile?.name || null;
  }

  // Semantic Memory
  for (const item of memory.semanticMemory || []) {

    if (
      similarity(item.text, text) >= 1
    ) {
      relevant.semanticMemory.push(item);
    }

  }

  // Long Term Memory
  for (const item of memory.longTermMemory || []) {

    if (
      similarity(item, text) >= 1
    ) {
      relevant.longTermMemory.push(item);
    }

  }

  // Priorities
  for (const item of memory.priorities || []) {

    if (
      similarity(item.text, text) >= 1
    ) {
      relevant.priorities.push(item);
    }

  }

  return relevant;

}
