import type { Title, TitleStatus, TitleType } from "@/types";

export const MAL_QUESTIONMARK_IMAGE =
  "https://cdn.myanimelist.net/images/questionmark_230x330.png";

type ReadingType = Exclude<TitleType, "anime">;

interface ReadingSeed {
  mal_id: number;
  type: ReadingType;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  image?: string;
  score: number;
  year: number | null;
  chapters?: number | null;
  volumes?: number | null;
  status: TitleStatus;
  genres: string[];
  author: string;
  rating?: string;
  season?: string | null;
  duration?: string;
  synopsis: string;
  popularity?: number;
  source?: string;
  aired?: string;
  published?: string;
}

export function createReadingTitle(seed: ReadingSeed): Title {
  const { genres, image = MAL_QUESTIONMARK_IMAGE, ...title } = seed;

  return {
    ...title,
    id: String(seed.mal_id),
    image,
    genres: genres.filter(Boolean).join("|"),
    studios: "",
    episodes: null,
    chapters: seed.chapters ?? null,
    volumes: seed.volumes ?? null,
    rating: seed.rating ?? "Not available",
    season: seed.season ?? null,
    duration: seed.duration ?? "Not available",
    popularity: seed.popularity ?? 999999,
  };
}

const readingSeeds: ReadingSeed[] = [
  {
    mal_id: 2,
    type: "manga",
    title: "Berserk",
    title_english: "Berserk",
    title_japanese: "ベルセルク",
    score: 9.47,
    year: 1989,
    status: "Publishing",
    genres: ["Action", "Adventure", "Award Winning", "Drama", "Fantasy", "Horror", "Supernatural"],
    author: "Kentaro Miura",
    popularity: 6,
    published: "Aug 1989 - ?",
    synopsis:
      "Guts, a branded mercenary with a massive sword, struggles against demons and fate while following the path of the hawk-shaped warrior Griffith.",
  },
  {
    mal_id: 25,
    type: "manga",
    title: "Fullmetal Alchemist",
    title_english: "Fullmetal Alchemist",
    title_japanese: "鋼の錬金術師",
    score: 9.03,
    year: 2001,
    chapters: 116,
    volumes: 27,
    status: "Completed",
    genres: ["Action", "Adventure", "Award Winning", "Drama", "Fantasy"],
    author: "Hiromu Arakawa",
    popularity: 11,
    published: "Jul 2001 - Jun 2010",
    synopsis:
      "Brothers Edward and Alphonse Elric search for the Philosopher's Stone after a failed attempt to restore their bodies through alchemy.",
  },
  {
    mal_id: 13,
    type: "manga",
    title: "One Piece",
    title_english: "One Piece",
    title_japanese: "ONE PIECE",
    score: 9.22,
    year: 1997,
    status: "Publishing",
    genres: ["Action", "Adventure", "Fantasy"],
    author: "Eiichiro Oda",
    popularity: 1,
    published: "Jul 1997 - ?",
    synopsis:
      "Monkey D. Luffy and the Straw Hat Pirates sail the Grand Line in search of the legendary treasure known as One Piece.",
  },
  {
    mal_id: 121496,
    type: "manhwa",
    title: "Solo Leveling",
    title_english: "Solo Leveling",
    title_japanese: null,
    score: 8.55,
    year: 2018,
    chapters: 201,
    volumes: 15,
    status: "Completed",
    genres: ["Action", "Adventure", "Fantasy"],
    author: "Chugong, Jang Sung-rak",
    popularity: 5,
    published: "Mar 2018 - May 2023",
    synopsis:
      "E-rank hunter Sung Jinwoo gains the ability to level up and grows from the weakest hunter into humanity's strongest defender.",
  },
  {
    mal_id: 122663,
    type: "manhwa",
    title: "Tower of God",
    title_english: "Tower of God",
    title_japanese: null,
    score: 8.33,
    year: 2010,
    status: "Publishing",
    genres: ["Action", "Adventure", "Drama", "Fantasy", "Mystery"],
    author: "SIU",
    popularity: 43,
    published: "Jul 2010 - ?",
    synopsis:
      "Bam enters a mysterious tower to find his friend Rachel and faces dangerous tests on each floor of the tower.",
  },
  {
    mal_id: 132214,
    type: "manhwa",
    title: "Omniscient Reader's Viewpoint",
    title_english: "Omniscient Reader's Viewpoint",
    title_japanese: null,
    score: 8.66,
    year: 2020,
    status: "Publishing",
    genres: ["Action", "Adventure", "Fantasy"],
    author: "sing N song, Sleepy-C",
    popularity: 74,
    published: "May 2020 - ?",
    synopsis:
      "Kim Dokja is the sole reader of a web novel whose apocalyptic story suddenly becomes the reality around him.",
  },
  {
    mal_id: 118730,
    type: "manhua",
    title: "Quanzhi Gaoshou",
    title_english: "The King's Avatar",
    title_japanese: null,
    score: 7.71,
    year: 2015,
    status: "Publishing",
    genres: ["Action"],
    author: "Hudie Lan, Changpan Yongzhe",
    popularity: 3609,
    published: "Sep 2015 - ?",
    synopsis:
      "Professional player Ye Xiu returns to the game Glory under a new character and works his way back toward the top.",
  },
  {
    mal_id: 72303,
    type: "manhua",
    title: "Douluo Dalu",
    title_english: "Soul Land",
    title_japanese: null,
    score: 7.8,
    year: 2011,
    status: "Publishing",
    genres: ["Action", "Adventure", "Fantasy"],
    author: "Tang Jia San Shao, Mu Feng Chun",
    popularity: 999999,
    published: "2011 - ?",
    synopsis:
      "Tang San carries his knowledge from another world into a land of martial souls and begins a new life at the Nuoding Academy.",
  },
  {
    mal_id: 137200,
    type: "manhua",
    title: "Mo Dao Zu Shi",
    title_english: "Grandmaster of Demonic Cultivation: Mo Dao Zu Shi",
    title_japanese: null,
    score: 8.65,
    year: 2017,
    chapters: 260,
    status: "Completed",
    genres: ["Action", "Adventure", "Drama", "Fantasy", "Mystery"],
    author: "Mo Xiang Tong Xiu, Luo Di Cheng Qiu",
    popularity: 1079,
    published: "Dec 2017 - Oct 2022",
    synopsis:
      "The resurrected Wei Wuxian reunites with Lan Wangji and uncovers the truth behind his infamous past.",
  },
  {
    mal_id: 81669,
    type: "novel",
    title: "Overlord",
    title_english: "Overlord",
    title_japanese: "オーバーロード",
    score: 8.61,
    year: 2012,
    status: "Publishing",
    genres: ["Action", "Fantasy"],
    author: "Maruyama Kugane, so-bin",
    popularity: 274,
    published: "Jul 2012 - ?",
    synopsis:
      "When a virtual reality game shuts down, Momonga and his guild base are transported to another world with their loyal NPCs.",
  },
  {
    mal_id: 70261,
    type: "novel",
    title: "Mushoku Tensei: Isekai Ittara Honki Dasu",
    title_english: "Mushoku Tensei: Jobless Reincarnation",
    title_japanese: "無職転生 ～異世界行ったら本気だす～",
    score: 8.81,
    year: 2014,
    chapters: 330,
    volumes: 26,
    status: "Completed",
    genres: ["Adventure", "Drama", "Fantasy"],
    author: "Rifujin na Magonote, Sirotaka",
    popularity: 161,
    published: "Jan 2014 - Nov 2022",
    synopsis:
      "A man given a second life in a magical world resolves to live seriously as Rudeus Greyrat and make the most of his new beginning.",
  },
  {
    mal_id: 74697,
    type: "novel",
    title: "Re:Zero kara Hajimeru Isekai Seikatsu",
    title_english: "Re:ZERO -Starting Life in Another World-",
    title_japanese: "Re：ゼロから始める異世界生活",
    score: 8.88,
    year: 2014,
    status: "Publishing",
    genres: ["Drama", "Fantasy", "Suspense"],
    author: "Nagatsuki Tappei, Ootsuka Shinichirou",
    popularity: 207,
    published: "Jan 2014 - ?",
    synopsis:
      "Subaru Natsuki is transported to another world and discovers that death sends him back to a previous point in time.",
  },
];

export const readingList: Title[] = readingSeeds.map(createReadingTitle);
export const readingCatalog = readingList;
