//vector.js
export async function getEmbedding(text, env) {
  if (!text || text.trim().length < 3) return null;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: { parts: [{ text: text.slice(0, 8000) }] }
        })
      }
    );

    const data = await response.json();
    return data.embedding?.values || null;
  } catch (e) {
    console.error("Embedding error:", e);
    return null;
  }
}

export async function storeVector(env, key, text, metadata = {}) {
  const embedding = await getEmbedding(text, env);
  if (!embedding) return false;

  const vectorId = `vec_${Date.now()}`;
  
  await env.VECTOR_INDEX.upsert([{
    id: vectorId,
    values: embedding,
    metadata: {
      originalKey: key,
      text: text.slice(0, 500),
      timestamp: Date.now(),
      ...metadata
    }
  }]);

  return vectorId;
}

export async function semanticSearch(env, query, limit = 8) {
  const queryEmbedding = await getEmbedding(query, env);
  if (!queryEmbedding) return [];

  const results = await env.VECTOR_INDEX.query(queryEmbedding, {
    topK: limit,
    returnMetadata: true
  });

  return results.matches || [];
}
