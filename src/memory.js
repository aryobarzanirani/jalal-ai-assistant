export async function getMemory(env, chatId) {
  const data = await env.MEMORY.get(chatId);

  if (!data) {
    return {
      history: [],
      name: null
    };
  }

  try {
    return JSON.parse(data);
  } catch {
    return {
      history: [],
      name: null
    };
  }
}

export async function saveMemory(env, chatId, memory) {
  await env.MEMORY.put(
    chatId,
    JSON.stringify(memory)
  );
}

// جلوگیری از ذخیره اسم‌های اشتباه
function isValidName(name) {
  if (!name) return false;

  const cleaned = name.trim();

  // خیلی کوتاه یا خیلی طولانی نباشد
  if (cleaned.length < 2 || cleaned.length > 25) return false;

  // شامل سوال نباشد
  if (cleaned.includes("?")) return false;

  // کلمات مشکوک
  const badWords = [
    "چیه",
    "چی",
    "کجاست",
    "کیه",
    "اسمم چیه",
    "نامم چیه"
  ];

  if (badWords.includes(cleaned)) return false;

  return true;
}

export function rememberName(memory, text) {
  const t = text.trim();

  const patterns = [
    /^اسم من\s+(.+?)\s*(است|هست|ه)?$/i,
    /^من\s+(.+?)\s+هستم$/i,
    /^من\s+(.{2,25})$/i
  ];

  for (const pattern of patterns) {
    const match = t.match(pattern);

    if (match) {
      const name = match[1].trim();

      if (isValidName(name)) {
        memory.name = name;
        return;
      }
    }
  }
}
