const fs = require("fs");
const path = require("path");

const normalizeName = require("./utils/normalize");
const similarity = require("./utils/similarity");

function classify(score) {
  if (score >= 0.9) return "EXACT_MATCH";
  if (score >= 0.75) return "POSSIBLE_MATCH";
  return "NO_MATCH";
}

function processRequest(userId, requestId) {
  const baseDir = path.join("data", userId, requestId);
  const inputFile = path.join(baseDir, "input", "input.json");
  const outputDir = path.join(baseDir, "output");

  console.log(`[${requestId}] Processing started`);

    if (!fs.existsSync(inputFile)) {
    console.error(`[${requestId}] input.json not found`);
    return;
  }

  if (fs.existsSync(outputDir)) {
    console.log(`[${requestId}] Output already exists. Skipping.`);
    return outputDir;
  }

  let inputData, watchlist;
  try {
    inputData = JSON.parse(fs.readFileSync(inputFile, "utf8"));
    watchlist = JSON.parse(fs.readFileSync("watchlist.json", "utf8"));
  } catch (err) {
    console.error(`[${requestId}] Invalid JSON`);
    return;
  }

    const names = Array.isArray(inputData.fullName)
    ? inputData.fullName
    : [inputData.fullName];

  let matches = [];

  for (const rawName of names) {
    const normalizedInput = normalizeName(rawName);

    for (const entry of watchlist) {
      const normalizedWatch = normalizeName(entry.name);
      const score = similarity(normalizedInput, normalizedWatch);

      matches.push({
        watchlistId: entry.id,
        watchlistName: entry.name,
        score: Number(score.toFixed(3))
      });
    }
  }

    matches.sort((a, b) => b.score - a.score);

  const top3 = matches.slice(0, 3);
  const best = top3[0];

    fs.mkdirSync(outputDir, { recursive: true });

  const detailed = {
    rawNames: names,
    normalizedNames: names.map(normalizeName),
    topMatches: top3,
    matchType: classify(best.score)
  };

  const consolidated = {
    finalMatch: best,
    matchType: classify(best.score),
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(outputDir, "detailed.json"),
    JSON.stringify(detailed, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "consolidated.json"),
    JSON.stringify(consolidated, null, 2)
  );

  console.log(`[${requestId}] Processing completed`);
  return outputDir;
}

module.exports = processRequest;

