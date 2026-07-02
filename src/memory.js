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

export function rememberName(memory, text) {
  const cleaned = text.trim();

  if (
    cleaned.includes("اسم من چیه") ||
    cleaned.includes("اسمم چیه")
  ) {
    return;
  }

  const patterns = [
    /^اسم من\s+(.+?)\s*(?:است|هست|ه)$/i,
    /^من\s+(.+?)\s+هستم$/i
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);

    if (match) {
      const name = match[1].trim();

      if (
        name.length > 0 &&
        name.length < 30
      ) {
        memory.name = name;
        return;
      }
    }
  }
}
