export function cleanupMemory(memory) {

  const today = new Date();

  // ShortTerm فقط 20 مورد آخر
  if (memory.shortTermMemory?.length > 20) {
    memory.shortTermMemory =
      memory.shortTermMemory.slice(-20);
  }

  // Semantic فقط 100 مورد آخر
  if (memory.semanticMemory?.length > 100) {
    memory.semanticMemory =
      memory.semanticMemory.slice(-100);
  }

  // Priorities فقط 50 مورد آخر
  if (memory.priorities?.length > 50) {
    memory.priorities =
      memory.priorities.slice(0, 50);
  }

  // حذف تسک‌های قدیمی‌تر از 7 روز
  if (memory.dailyContext?.tasks) {

    memory.dailyContext.tasks =
      memory.dailyContext.tasks.filter(task => {

        if (!task.date) return true;

        const taskDate = new Date(task.date);

        const diff =
          (today - taskDate) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;

      });

  }

}
