import {
  Calendar,
  Clock,
  Library,
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
      href: "/",
      icon: Search,
    },
    {
      name: "الرائج",
      href: "/",
      icon: TrendingUp,
    },
    {
      name: "الأحدث",
      href: "/",
      icon: Clock,
    },
    {
      name: "القادم",
      href: "/",
      icon: Calendar,
    },
  ],
  community: [
    {
      name: "مراجعات",
      href: "/",
      icon: Star,
    },
    {
      name: "مناقشات",
      href: "/",
      icon: Users,
    },
    {
      name: "قوائم الكتب",
      href: "/",
      icon: Library,
    },
  ],
};
