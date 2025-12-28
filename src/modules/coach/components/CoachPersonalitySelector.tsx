/**
 * CoachPersonalitySelector - Sélecteur de personnalité du coach
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, Brain, Flame, Leaf, Zap, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CoachPersonality = 'empathetic' | 'analytical' | 'motivational' | 'zen' | 'energetic';

interface PersonalityOption {
  value: CoachPersonality;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const PERSONALITIES: PersonalityOption[] = [
  {
    value: 'empathetic',
    label: 'Empathique',
    description: 'Écoute active et soutien bienveillant',
    icon: Heart,
    color: 'text-pink-500',
  },
  {
    value: 'analytical',
    label: 'Analytique',
    description: 'Solutions logiques et structurées',
    icon: Brain,
    color: 'text-blue-500',
  },
  {
    value: 'motivational',
    label: 'Motivant',
    description: 'Encouragement et défis positifs',
    icon: Flame,
    color: 'text-orange-500',
  },
  {
    value: 'zen',
    label: 'Zen',
    description: 'Pleine conscience et sérénité',
    icon: Leaf,
    color: 'text-green-500',
  },
  {
    value: 'energetic',
    label: 'Dynamique',
    description: 'Énergie positive et action',
    icon: Zap,
    color: 'text-yellow-500',
  },
];

interface CoachPersonalitySelectorProps {
  value: CoachPersonality;
  onChange: (personality: CoachPersonality) => void;
  disabled?: boolean;
}

export const CoachPersonalitySelector = memo(function CoachPersonalitySelector({
  value,
  onChange,
  disabled = false,
}: CoachPersonalitySelectorProps) {
  const selected = PERSONALITIES.find((p) => p.value === value) ?? PERSONALITIES[0];
  const Icon = selected.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Icon className={`h-4 w-4 ${selected.color}`} />
          {selected.label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {PERSONALITIES.map((personality) => {
          const ItemIcon = personality.icon;
          return (
            <DropdownMenuItem
              key={personality.value}
              onClick={() => onChange(personality.value)}
              className="flex flex-col items-start gap-1 py-2"
            >
              <div className="flex items-center gap-2">
                <ItemIcon className={`h-4 w-4 ${personality.color}`} />
                <span className="font-medium">{personality.label}</span>
                {personality.value === value && (
                  <span className="ml-auto text-xs text-primary">✓</span>
                )}
              </div>
              <span className="ml-6 text-xs text-muted-foreground">
                {personality.description}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
