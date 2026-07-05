import { extractDate } from "./date-parser.js";
import { hasTask } from "./task-utils.js";
export function updateDailyContext(memory, userText) {
  if (
  !userText ||
  userText.length > 1000 ||
  userText.trim().startsWith("{") ||
  userText.includes('"profile"')
) {
  return;
  }
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
      if (!hasTask(memory.dailyContext.tasks, text)) {
  memory.dailyContext.tasks.push({
  text,
  date: extractDate(text),
  completed: false,
  createdAt: Date.now()
});
}
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
