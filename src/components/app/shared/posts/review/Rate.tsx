import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export default function Rate({ rate }: { rate: number }) {
  return (
    <Badge
      className={cn(
        "font-sans",
        rate >= 7
          ? "text-green-500"
          : rate >= 5
            ? "text-yellow-500"
            : "text-red-500",
      )}
      variant={rate >= 7 ? "success" : rate >= 5 ? "warning" : "destructive"}
    >
      <span className="inline-block">{rate}</span> <Star className="size-3" />
    </Badge>
  );
}
