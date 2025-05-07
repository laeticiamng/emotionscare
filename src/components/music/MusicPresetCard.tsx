
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, PlayCircle } from 'lucide-react';

interface MusicPresetProps {
  preset: {
    name: string;
    description: string;
    genre: string;
    mood: string;
    tempo: number;
    duration: number;
    instruments?: string[];
    icon: React.ReactNode;
  };
  onSelect: (preset: any) => void;
  isActive?: boolean;
}

const MusicPresetCard: React.FC<MusicPresetProps> = ({ preset, onSelect, isActive = false }) => {
  return (
    <Card 
      className={`hover:bg-muted/40 transition-colors cursor-pointer ${isActive ? 'border-primary border-2' : ''}`}
      onClick={() => onSelect(preset)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-primary ${isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
            {preset.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{preset.name}</p>
            <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
          </div>
          <Button variant={isActive ? "default" : "ghost"} size="sm" className="ml-auto">
            {isActive ? (
              <Music className="h-3.5 w-3.5 mr-1" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5 mr-1" />
            )}
            <span className="text-xs">{isActive ? "Actif" : "Utiliser"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPresetCard;
