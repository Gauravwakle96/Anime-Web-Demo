import fs from "fs";

const animeContent = fs.readFileSync("src/data/anime.ts", "utf8");
const expandedContent = fs.readFileSync("src/data/expandedAnime.ts", "utf8");
const readingContent = fs.readFileSync("src/data/reading.ts", "utf8");

const staticIDs = [...animeContent.matchAll(/mal_id:\s*(\d+)/g)].map(m => parseInt(m[1]));
const expandedIDs = [...expandedContent.matchAll(/"mal_id":\s*(\d+)/g)].map(m => parseInt(m[1]));
const readingIDs = [...readingContent.matchAll(/mal_id:\s*(\d+)/g)].map(m => parseInt(m[1]));

const existingAnime = new Set([...staticIDs, ...expandedIDs]);
const existingReading = new Set(readingIDs);

fs.writeFileSync("existing_ids.json", JSON.stringify({
  staticIDs,
  expandedIDs,
  existingAnimeIDs: [...existingAnime].sort((a,b) => a-b),
  existingReadingIDs: [...existingReading].sort((a,b) => a-b),
  readingCount: readingIDs.length,
  animeCount: existingAnime.size
}, null, 2));

console.log({ static: staticIDs.length, expanded: expandedIDs.length, anime: existingAnime.size, reading: readingIDs.length });
