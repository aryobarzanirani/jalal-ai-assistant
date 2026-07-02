export async function getMemory(env, chatId) {

  const data = await env.MEMORY.get(chatId);

  if (!data) {

    return {
      history: [],
      name: null
    };

  }

  return JSON.parse(data);

}

export async function saveMemory(env, chatId, memory) {

  await env.MEMORY.put(
    chatId,
    JSON.stringify(memory)
  );

}

export function rememberName(memory, text) {

  const m = text.match(/(?:اسم من|من)\s+(.+)/);

  if (m) {

    memory.name = m[1].trim();

  }

}
