// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface PresetProps {
  name: string;
  description?: string;
  genre?: string;
  mood?: string;
  tempo?: number;
  duration?: number;
  instruments?: string[];
  icon?: React.ReactNode;
}

interface MusicPresetCardProps {
  preset: PresetProps;
  onSelect: (preset: PresetProps) => void;
  isActive?: boolean;
}

const MusicPresetCard: React.FC<MusicPresetCardProps> = ({ 
  preset, 
  onSelect, 
  isActive = false 
}) => {
  return (
    <div 
      className={`
        flex items-center justify-between p-2 rounded-md
        ${isActive 
          ? 'bg-primary/20 border border-primary/30' 
          : 'bg-muted/40 hover:bg-muted/60'}
        transition-colors cursor-pointer
      `}
      onClick={() => onSelect(preset)}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
          {preset.icon || <span className="block w-4 h-4" />}
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium">{preset.name}</p>
          {preset.description && (
            <p className="text-xs text-muted-foreground">{preset.description}</p>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(preset);
        }}
        className="h-8 w-8 p-0 rounded-full"
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MusicPresetCard;
