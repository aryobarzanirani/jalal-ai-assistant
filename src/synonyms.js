const groups = [
  ["ماشین","خودرو","اتومبیل","وسیله نقلیه"],

  ["لاستیک","تایر"],

  ["گل","گل‌ها","گیاه","گیاهان","باغچه"],

  ["بیمارستان","درمانگاه","کلینیک"],

  ["همسر","زن","خانم"],

  ["شوهر","همسر"],

  ["دختر","دخترم"],

  ["پسر","پسرم"],

  ["پزشک","دکتر"],

  ["کار","شغل","شیفت"],

  ["ربات","دستیار","هوش مصنوعی","AI"]
];

export function expandWords(words) {

  const result = new Set(words);

  for (const word of words) {

    for (const group of groups) {

      if (group.includes(word)) {

        group.forEach(w => result.add(w));

      }

    }

  }

  return [...result];

}
