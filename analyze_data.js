const fs = require("fs");

const animeContent = fs.readFileSync("src/data/expandedAnime.ts", "utf8");
const readingContent = fs.readFileSync("src/data/reading.ts", "utf8");

// Extract anime MAL IDs
const animeIDs = [...animeContent.matchAll(/"mal_id":\s*(\d+)/g)].map(m => parseInt(m[1]));

// Extract reading entries - match mal_id followed by type
const readingMatches = [...readingContent.matchAll(/mal_id:\s*(\d+)\s*\n\s*type:\s*"(\w+)"/g)];
const readingIDs = readingMatches.map(m => parseInt(m[1]));

// Count by type
const typeCounts = {};
readingMatches.forEach(m => (typeCounts[m[2]] = (typeCounts[m[2]] || 0) + 1));

console.log("Anime count:", animeIDs.length);
console.log("Reading counts by type:", typeCounts);
console.log("Total reading entries:", readingIDs.length);
console.log("Anime IDs range:", Math.min(...animeIDs), "-", Math.max(...animeIDs));
console.log("Reading IDs range:", Math.min(...readingIDs), "-", Math.max(...readingIDs));

// Find unique IDs across both files
const allIDs = new Set([...animeIDs, ...readingIDs]);
console.log("Total unique IDs:", allIDs.size);

// Save IDs to a file for reference
fs.writeFileSync("existing_ids.json", JSON.stringify({ animeIDs, readingIDs, typeCounts }, null, 2));
