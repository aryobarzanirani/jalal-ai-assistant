
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
  const patterns = [
    /اسم من\s+(.+?)\s*(?:است|هست)?$/i,
    /من\s+(.+?)\s+هستم$/i,
    /من\s+(.+)$/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      const name = match[1].trim();

      if (name.length < 50) {
        memory.name = name;
        return;
      }
    }
  }
}
