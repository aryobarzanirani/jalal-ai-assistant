export function consolidateMemory(memory) {

  if (!memory) {
    return memory;
  }

  consolidateSemantic(memory);
  consolidateGoals(memory);
  consolidatePreferences(memory);
  consolidatePriorities(memory);

  return memory;
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
