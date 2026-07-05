function normalizeTask(text) {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[؟?!]/g, "");
}

export function hasTask(tasks, text) {
  const target = normalizeTask(text);

  return (tasks || []).some(
    task => normalizeTask(task) === target
  );
}
