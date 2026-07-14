export function alreadyExists(list, text) {

  if (!Array.isArray(list)) {
    return false;
  }

  const normalize = value =>
    String(value)
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[؟?!]/g, "");

  const target = normalize(text);

  return list.some(item => {

    if (typeof item === "string") {
      return normalize(item) === target;
    }

    if (item?.text) {
      return normalize(item.text) === target;
    }

    return false;

  });

}
