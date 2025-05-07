
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Heart, Brain, Sun, Moon } from 'lucide-react';

interface PresetProps {
  name: string;
  description: string;
  genre: string;
  mood: string;
  tempo: number;
  duration: number;
  instruments?: string[];
  icon: React.ReactNode;
}

interface RecommendedPresetsProps {
  onSelectPreset: (preset: Omit<PresetProps, 'icon' | 'description'>) => void;
  emotion?: any; // Add the emotion property to the interface
}

const presets: PresetProps[] = [
  {
    name: "Méditation matinale",
    description: "Sons apaisants pour bien commencer la journée",
    genre: "ambient",
    mood: "calm",
    tempo: 70,
    duration: 180,
    instruments: ["piano", "strings"],
    icon: <Sun className="h-4 w-4" />
  },
  {
    name: "Concentration profonde",
    description: "Rythme idéal pour le travail intellectuel",
    genre: "lofi",
    mood: "focused",
    tempo: 85,
    duration: 240,
    instruments: ["piano", "synth"],
    icon: <Brain className="h-4 w-4" />
  },
  {
    name: "Relaxation du soir",
    description: "Mélodies douces pour se détendre avant le coucher",
    genre: "classical",
    mood: "melancholic",
    tempo: 60,
    duration: 300,
    instruments: ["piano", "strings", "flute"],
    icon: <Moon className="h-4 w-4" />
  },
  {
    name: "Énergie positive",
    description: "Rythmes dynamisants pour rester motivé",
    genre: "electronic",
    mood: "happy",
    tempo: 120,
    duration: 150,
    instruments: ["synth", "percussion"],
    icon: <Heart className="h-4 w-4" />
  },
];

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({ onSelectPreset, emotion }) => {
  // You can use the emotion prop here to customize presets if needed
  // For example, filtering or sorting presets based on the emotion
  
  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <Card 
          key={preset.name} 
          className="hover:bg-muted/40 transition-colors cursor-pointer"
          onClick={() => onSelectPreset({
            name: preset.name,
            genre: preset.genre,
            mood: preset.mood,
            tempo: preset.tempo,
            duration: preset.duration,
            instruments: preset.instruments,
          })}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {preset.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{preset.name}</p>
                <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Music className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Utiliser</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendedPresets;
