export function extractDate(text) {
  const today = new Date();

  const d = new Date(today);

  if (text.includes("امروز")) {
    return formatDate(d);
  }

  if (text.includes("امشب")) {
    return formatDate(d);
  }

  if (text.includes("فردا")) {
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }

  if (text.includes("پس فردا")) {
    d.setDate(d.getDate() + 2);
    return formatDate(d);
  }

  return null;
}

function formatDate(date) {
  return date.toISOString().slice(0,10);
}
