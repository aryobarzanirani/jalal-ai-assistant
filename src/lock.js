export async function acquireLock(env, chatId) {
  const key = `lock:${chatId}`;

  const existing = await env.MEMORY.get(key);

  if (existing) {
    return false;
  }

  await env.MEMORY.put(
    key,
    "locked",
    {
      expirationTtl: 30
    }
  );

  return true;
}

export async function releaseLock(env, chatId) {
  const key = `lock:${chatId}`;
  await env.MEMORY.delete(key);
}
