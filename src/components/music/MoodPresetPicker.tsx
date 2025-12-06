import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Focus, Zap, Bed, Heart, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export type MoodPreset = 'calme' | 'focus' | 'energie_douce' | 'sommeil' | 'uplift' | 'ambient';

interface MoodPresetPickerProps {
  value: MoodPreset;
  onChange: (preset: MoodPreset) => void;
  disabled?: boolean;
}

const presets = [
  {
    id: 'calme' as MoodPreset,
    label: 'Calme',
    description: 'Détente et relaxation',
    icon: Moon,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    color: 'text-blue-600'
  },
  {
    id: 'focus' as MoodPreset,
    label: 'Focus',
    description: 'Concentration profonde',
    icon: Focus,
    gradient: 'from-purple-500/10 to-indigo-500/10',
    color: 'text-purple-600'
  },
  {
    id: 'energie_douce' as MoodPreset,
    label: 'Énergie douce',
    description: 'Vitalité subtile',
    icon: Zap,
    gradient: 'from-green-500/10 to-emerald-500/10',
    color: 'text-green-600'
  },
  {
    id: 'sommeil' as MoodPreset,
    label: 'Sommeil',
    description: 'Préparation au repos',
    icon: Bed,
    gradient: 'from-indigo-500/10 to-purple-500/10',
    color: 'text-indigo-600'
  },
  {
    id: 'uplift' as MoodPreset,
    label: 'Uplift',
    description: 'Élévation d\'humeur',
    icon: Heart,
    gradient: 'from-pink-500/10 to-rose-500/10',
    color: 'text-pink-600'
  },
  {
    id: 'ambient' as MoodPreset,
    label: 'Ambient',
    description: 'Atmosphère immersive',
    icon: Cloud,
    gradient: 'from-gray-500/10 to-slate-500/10',
    color: 'text-gray-600'
  }
];

export const MoodPresetPicker: React.FC<MoodPresetPickerProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Choisissez votre ambiance
            </h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez le mood qui correspond à votre état
            </p>
          </div>
          
          <div 
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
            role="radiogroup"
            aria-label="Sélection d'ambiance musicale"
          >
            {presets.map((preset, index) => {
              const Icon = preset.icon;
              const isSelected = value === preset.id;
              
              return (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`
                      w-full h-auto p-4 flex flex-col items-center gap-2
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      ${!isSelected ? `bg-gradient-to-br ${preset.gradient}` : ''}
                    `}
                    onClick={() => onChange(preset.id)}
                    disabled={disabled}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${preset.label}: ${preset.description}`}
                  >
                    <Icon 
                      className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : preset.color}`} 
                    />
                    <div className="text-center">
                      <div className="font-medium text-sm">
                        {preset.label}
                      </div>
                      <div className="text-xs opacity-70">
                        {preset.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {value && (
            <div className="text-center">
              <Badge variant="secondary">
                Ambiance sélectionnée: {presets.find(p => p.id === value)?.label}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};