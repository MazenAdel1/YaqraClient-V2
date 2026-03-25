import { Library, Star, Target, UsersRound } from "lucide-react";

export const TABS = [
  {
    title: "المراجعات",
    value: "reviews",
    icon: Star,
  },
  {
    title: "المناقشات",
    value: "discussions",
    icon: UsersRound,
  },
  {
    title: "قائمة الكتب",
    value: "playlists",
    icon: Library,
  },
  {
    title: "الأهداف",
    value: "goals",
    icon: Target,
  },
] as const;
