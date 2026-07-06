export function consolidateMemory(memory) {

  if (!memory) {
    return memory;
  }

  consolidateSemantic(memory);
  consolidateGoals(memory);
  consolidatePreferences(memory);
  consolidatePriorities(memory);
  consolidateDaily(memory);

  mergeSemantic(memory);

  return memory;
}

function consolidateDaily(memory) {

  if (!memory.dailyContext) {
    return;
  }

  memory.dailyContext.tasks =
    removeDuplicates(
      memory.dailyContext.tasks,
      "text"
    );

  memory.dailyContext.events =
    removeDuplicates(
      memory.dailyContext.events
    );

}

function removeDuplicates(list, key = null) {

  const seen = new Set();

  return (list || []).filter(item => {

    const value =
      key
        ? item?.[key]
        : item;

    const normalized =
      String(value || "")
        .trim()
        .toLowerCase();

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);

    return true;

  });

}
function consolidateSemantic(memory) {

  memory.semanticMemory =
    removeDuplicates(
      memory.semanticMemory,
      "text"
    );

}

function consolidateGoals(memory) {

  memory.profile.goals =
    removeDuplicates(memory.profile.goals);

  if (memory.profile.goals.length > 20) {
    memory.profile.goals =
      memory.profile.goals.slice(-20);
  }

}
function consolidatePreferences(memory) {

  memory.profile.preferences =
    removeDuplicates(
      memory.profile.preferences
    );

  if (
    memory.profile.preferences.length > 20
  ) {
    memory.profile.preferences =
      memory.profile.preferences.slice(-20);
  }

}
function consolidatePriorities(memory) {

  memory.priorities =
    removeDuplicates(
      memory.priorities,
      "text"
    );

  memory.priorities.sort(
    (a, b) => b.score - a.score
  );

  if (memory.priorities.length > 50) {
    memory.priorities =
      memory.priorities.slice(0, 50);
  }

}
function mergeSemantic(memory) {

  const merged = [];

  for (const item of memory.semanticMemory) {

    const exists = merged.find(x =>
      x.category === item.category &&
      x.text.includes(item.text)
    );

    if (!exists) {
      merged.push(item);
    }

  }

  memory.semanticMemory = merged;

}
