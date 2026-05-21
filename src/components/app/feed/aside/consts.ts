import {
  Calendar,
  Clock,
  Library,
  Lightbulb,
  LucideIcon,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Route } from "next";

export const ASIDE_LINKS: {
  books: {
    name: string;
    href: Route;
    icon: LucideIcon;
  }[];
  community: {
    name: string;
    href: Route;
    icon: LucideIcon;
  }[];
} = {
  books: [
    {
      name: "البحث عن كتاب",
      href: "/book-finder",
      icon: Search,
    },
    {
      name: "الرائج",
      href: "/books?type=trending",
      icon: TrendingUp,
    },
    {
      name: "مقترحات",
      href: "/books?type=recommendations",
      icon: Lightbulb,
    },
    {
      name: "الأحدث",
      href: "/books?type=recent",
      icon: Clock,
    },
    {
      name: "القادم",
      href: "/books?type=upcoming",
      icon: Calendar,
    },
  ],
  community: [
    {
      name: "مراجعات",
      href: "/community?type=reviews",
      icon: Star,
    },
    {
      name: "مناقشات",
      href: "/community?type=discussions",
      icon: Users,
    },
    {
      name: "قوائم الكتب",
      href: "/community?type=playlists",
      icon: Library,
    },
  ],
};
