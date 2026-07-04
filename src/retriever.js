export function getRelevantMemory(memory, userText) {
  const text = userText.trim();

  const relevant = {
    profile: {},
    shortTermMemory:
      memory.shortTermMemory?.slice(-8) || [],
    longTermMemory: []
  };

  // Family related
  if (
    text.includes("دختر") ||
    text.includes("پسر") ||
    text.includes("همسر") ||
    text.includes("زن")
  ) {
    relevant.profile.family =
      memory.profile?.family || {};
  }

  // Preference related
  if (
    text.includes("علاقه") ||
    text.includes("دوست دارم")
  ) {
    relevant.profile.preferences =
      memory.profile?.preferences || [];
  }

  // Goal related
  if (
    text.includes("پروژه") ||
    text.includes("هدف") ||
    text.includes("کار")
  ) {
    relevant.profile.goals =
      memory.profile?.goals || [];
  }

  // Name related
  if (
    text.includes("اسم")
  ) {
    relevant.profile.name =
      memory.profile?.name || null;
  }

  return relevant;
}
