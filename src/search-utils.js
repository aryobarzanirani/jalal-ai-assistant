import { expandWords }
from "./synonyms.js";
import { expandWords } from "./synonyms.js";
function normalize(text) {

  return String(text)
    .toLowerCase()
    .replace(/[ي]/g,"ی")
    .replace(/[ك]/g,"ک")
    .replace(/[^\p{L}\p{N}\s]/gu," ")
    .replace(/\s+/g," ")
    .trim();

}

function expandDynamic(memory, words) {

  const result = new Set(words);

  if (!memory?.dynamicSynonyms) {
    return [...result];
  }

  for (const word of words) {

    const list =
      memory.dynamicSynonyms[word];

    if (list) {

      list.forEach(x => result.add(x));

    }

  }

  return [...result];

}

export function similarity(a,b) {

  const wa =
    expandWords(
      normalize(a).split(" ")
    );

  const wb =
    expandWords(
      normalize(b).split(" ")
    );

  let score = 0;

  for (const word of wa) {

    if (wb.includes(word)) {

      score++;

    }

  }

  return score;

      }
