function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .sort()
    .join(" ");
}

module.exports = normalizeName;
