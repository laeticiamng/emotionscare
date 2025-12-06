import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Clock } from "lucide-react";

interface CopyBadgeProps {
  kind: "progression" | "intensité" | "durée";
  idx?: number;
  className?: string;
}

const COPY_MAP = {
  progression: ["commence", "en cours", "ça vient", "beau progrès", "au top"],
  intensité: ["très doux", "doux", "modéré", "soutenu"],
  durée: ["une minute", "un petit moment", "quelques minutes"]
} as const;

const ICON_MAP = {
  progression: TrendingUp,
  intensité: Zap,
  durée: Clock
};

export function CopyBadge({ kind, idx = 0, className = "" }: CopyBadgeProps) {
  const copyArray = COPY_MAP[kind];
  const Icon = ICON_MAP[kind];
  const safeIndex = Math.max(0, Math.min(copyArray.length - 1, idx));
  const text = copyArray[safeIndex];

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center space-x-1 ${className}`}
      aria-label={`${kind}: ${text}`}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </Badge>
  );
}