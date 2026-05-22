export const COMMUNITY_KEYS = {
  reviews: "allReviews",
  discussions: "allDiscussions",
  playlists: "allPlaylists",
} as const;

export const DISCUSSIONS_FILTERS = [
  { label: "نقاش", value: "0" },
  { label: "مقال", value: "1" },
  { label: "أخبار", value: "2" },
] as const;
