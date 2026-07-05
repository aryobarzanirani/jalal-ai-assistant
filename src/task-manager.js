export function completeLastTask(memory) {
  const tasks = memory?.dailyContext?.tasks || [];

  for (let i = tasks.length - 1; i >= 0; i--) {
    if (!tasks[i].completed) {
      tasks[i].completed = true;
      tasks[i].completedAt = Date.now();
      return tasks[i];
    }
  }

  return null;
}
