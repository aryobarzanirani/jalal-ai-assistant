function normalizeTask(text) {
  return String(text)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[؟?!]/g, "");
}

export function hasTask(tasks, text) {
  const target = normalizeTask(text);

  return (tasks || []).some(task => {
    if (typeof task === "string") {
      return normalizeTask(task) === target;
    }

    if (task?.text) {
      return normalizeTask(task.text) === target;
    }

    return false;
  });
}
