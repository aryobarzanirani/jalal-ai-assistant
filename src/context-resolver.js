export function resolveLastTask(memory) {

  const tasks =
    memory?.dailyContext?.tasks || [];

  for (
    let i = tasks.length - 1;
    i >= 0;
    i--
  ) {

    if (!tasks[i].completed) {
      return tasks[i];
    }

  }

  return null;

}
