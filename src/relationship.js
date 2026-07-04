export function extractRelationships(memory, text) {
  if (!memory.relationships) {
    memory.relationships = [];
  }

  const patterns = [
    {
      regex: /(.+?)\s+مادر\s+(.+?)\s+است/,
      relation: "mother_of"
    },
    {
      regex: /(.+?)\s+پدر\s+(.+?)\s+است/,
      relation: "father_of"
    },
    {
      regex: /(.+?)\s+همسر\s+(.+?)\s+است/,
      relation: "spouse_of"
    },
    {
      regex: /(.+?)\s+پسرخاله\s+(.+?)\s+است/,
      relation: "cousin_of"
    }
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern.regex);

    if (match) {
      const from = match[1].trim();
      const to = match[2].trim();

      memory.relationships.push({
        from,
        relation: pattern.relation,
        to
      });

      if (memory.relationships.length > 50) {
        memory.relationships =
          memory.relationships.slice(-50);
      }

      return;
    }
  }
}
