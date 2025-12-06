/**
 * TechniqueSelector - Sélecteur de technique de méditation
 */

import { Button } from '@/components/ui/button';
import { Brain, Eye, Heart, Wind, Sparkles, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MeditationTechnique } from '../types';
import { techniqueLables, techniqueDescriptions } from '../types';

const techniqueIcons: Record<MeditationTechnique, React.ComponentType<any>> = {
  'mindfulness': Brain,
  'body-scan': Eye,
  'loving-kindness': Heart,
  'breath-focus': Wind,
  'visualization': Sparkles,
  'mantra': Music,
};

interface TechniqueSelectorProps {
  selected: MeditationTechnique;
  onSelect: (technique: MeditationTechnique) => void;
}

export function TechniqueSelector({ selected, onSelect }: TechniqueSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {(Object.keys(techniqueLables) as MeditationTechnique[]).map((technique) => {
        const Icon = techniqueIcons[technique];
        const isSelected = selected === technique;

        return (
          <Button
            key={technique}
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => onSelect(technique)}
            className={cn(
              'h-auto p-4 flex-col gap-2',
              isSelected && 'border-primary'
            )}
          >
            <Icon className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium text-sm">{techniqueLables[technique]}</div>
              <div className="text-xs opacity-80 mt-1">
                {techniqueDescriptions[technique]}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}
