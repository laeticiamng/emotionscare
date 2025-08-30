import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Clock } from "lucide-react";

interface CopyBadgeProps {
  kind: "progression" | "intensité" | "durée";
  value?: number;
  className?: string;
}

const badgeConfig = {
  progression: {
    icon: TrendingUp,
    getText: (value?: number) => {
      if (!value) return "Progression";
      if (value < 25) return "Début de parcours";
      if (value < 50) return "En progression";
      if (value < 75) return "Bien avancé";
      return "Maîtrise développée";
    }
  },
  intensité: {
    icon: Zap,
    getText: (value?: number) => {
      if (!value) return "Intensité";
      if (value < 30) return "Doux";
      if (value < 60) return "Modéré";
      if (value < 80) return "Intense";
      return "Très intense";
    }
  },
  durée: {
    icon: Clock,
    getText: (value?: number) => {
      if (!value) return "Durée";
      if (value < 5) return "Flash";
      if (value < 15) return "Bref";
      if (value < 30) return "Équilibré";
      return "Approfondi";
    }
  }
};

export function CopyBadge({ kind, value, className = "" }: CopyBadgeProps) {
  const config = badgeConfig[kind];
  const Icon = config.icon;
  const text = config.getText(value);

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center space-x-1 ${className}`}
      aria-label={`${kind}: ${text}${value ? ` (${value})` : ''}`}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </Badge>
  );
}