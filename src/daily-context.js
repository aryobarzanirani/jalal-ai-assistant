export function updateDailyContext(memory, userText) {
  if (!memory.dailyContext) {
    memory.dailyContext = {
      date: null,
      tasks: [],
      events: [],
      mood: null
    };
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (memory.dailyContext.date !== today) {
    memory.dailyContext = {
      date: today,
      tasks: [],
      events: [],
      mood: null
    };
  }

  const text = userText.trim();

  // Tasks
  const taskTriggers = [
    "باید",
    "لازم دارم",
    "امروز باید"
  ];

  for (const trigger of taskTriggers) {
    if (text.includes(trigger)) {
      memory.dailyContext.tasks.push(text);
      break;
    }
  }

  // Events
  const eventTriggers = [
    "امروز",
    "رفتم",
    "جلسه"
  ];

  for (const trigger of eventTriggers) {
    if (text.includes(trigger)) {
      memory.dailyContext.events.push(text);
      break;
    }
  }

  // Mood
  if (
    text.includes("خسته") ||
    text.includes("ناراحتم")
  ) {
    memory.dailyContext.mood = "negative";
  }

  if (
    text.includes("خوشحالم") ||
    text.includes("عالی")
  ) {
    memory.dailyContext.mood = "positive";
  }
}
