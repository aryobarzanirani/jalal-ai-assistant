export function rememberSynonym(memory, text) {

  if (!memory.dynamicSynonyms) {
    memory.dynamicSynonyms = {};
  }

  const patterns = [

    /^(.+?)\s+یعنی\s+(.+)$/,

    /^(.+?)\s+همان\s+(.+)$/,

    /^(.+?)\s+همون\s+(.+)$/,

    /^(.+?)\s+اسم دیگر\s+(.+)$/

  ];

  for (const pattern of patterns) {

    const match = text.match(pattern);

    if (!match) continue;

    const a = match[1].trim();

    const b = match[2].trim();

    if (!memory.dynamicSynonyms[a]) {
      memory.dynamicSynonyms[a] = [];
    }

    if (!memory.dynamicSynonyms[a].includes(b)) {
      memory.dynamicSynonyms[a].push(b);
    }

    if (!memory.dynamicSynonyms[b]) {
      memory.dynamicSynonyms[b] = [];
    }

    if (!memory.dynamicSynonyms[b].includes(a)) {
      memory.dynamicSynonyms[b].push(a);
    }

    return;

  }

}
