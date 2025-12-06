import React, { useEffect, useState } from 'react';
import { LucideIconType } from '@/types/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  Zap,
  Heart,
  Music,
  Focus,
  Coffee,
  Moon,
  Sun,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { moodPresetsService } from '@/services/moodPresetsService';
import { MoodPresetRecord } from '@/types/mood-mixer';

interface BlendState {
  joy: number;
  calm: number;
  energy: number;
  focus: number;
}

interface MoodPresetCard {
  id: string;
  name: string;
  description: string;
  icon: LucideIconType;
  gradient: string;
  blend: BlendState;
  tags: string[];
}

interface PresetSelectorProps {
  onPresetSelect: (blend: BlendState) => void;
  currentBlend: BlendState;
}

const ICON_MAP: Record<string, LucideIconType> = {
  sun: Sun,
  focus: Focus,
  music: Music,
  heart: Heart,
  zap: Zap,
  moon: Moon,
  headphones: Headphones,
  coffee: Coffee,
  sparkles: Sparkles,
};

interface PresetSeed {
  slug: string;
  name: string;
  description: string;
  icon: keyof typeof ICON_MAP;
  gradient: string;
  blend: BlendState;
  tags: string[];
}

const resolveIcon = (iconName?: string | null): LucideIconType => {
  if (!iconName) return Sparkles;
  const key = iconName.toLowerCase();
  return ICON_MAP[key] ?? Sparkles;
};

const mapRecordToCard = (record: MoodPresetRecord): MoodPresetCard => ({
  id: record.slug ?? record.id,
  name: record.name,
  description: record.description ?? 'Ambiance personnalisée générée',
  icon: resolveIcon(record.icon),
  gradient: record.gradient ?? 'from-purple-500 to-pink-500',
  blend: record.blend,
  tags: record.tags.length ? record.tags : ['Mood Mixer'],
});

const DEFAULT_PRESETS: PresetSeed[] = [
  {
    slug: 'morning-boost',
    name: 'Réveil Énergique',
    description: 'Commencez la journée avec dynamisme',
    icon: 'sun',
    gradient: 'from-orange-400 to-yellow-500',
    blend: { joy: 0.8, calm: 0.3, energy: 0.9, focus: 0.6 },
    tags: ['Matin', 'Énergie', 'Motivation'],
  },
  {
    slug: 'deep-focus',
    name: 'Focus Intense',
    description: 'Concentration maximale pour le travail',
    icon: 'focus',
    gradient: 'from-green-500 to-emerald-600',
    blend: { joy: 0.4, calm: 0.7, energy: 0.5, focus: 0.95 },
    tags: ['Travail', 'Concentration', 'Productivité'],
  },
  {
    slug: 'creative-flow',
    name: 'Flow Créatif',
    description: 'Libérez votre créativité',
    icon: 'music',
    gradient: 'from-purple-500 to-pink-500',
    blend: { joy: 0.7, calm: 0.6, energy: 0.7, focus: 0.8 },
    tags: ['Créativité', 'Inspiration', 'Art'],
  },
  {
    slug: 'zen-meditation',
    name: 'Méditation Zen',
    description: 'Paix intérieure et relaxation profonde',
    icon: 'heart',
    gradient: 'from-blue-400 to-cyan-500',
    blend: { joy: 0.6, calm: 0.95, energy: 0.2, focus: 0.4 },
    tags: ['Méditation', 'Calme', 'Relaxation'],
  },
  {
    slug: 'workout-power',
    name: 'Puissance Sport',
    description: "Énergie explosive pour l'entraînement",
    icon: 'zap',
    gradient: 'from-red-500 to-orange-600',
    blend: { joy: 0.6, calm: 0.2, energy: 1.0, focus: 0.7 },
    tags: ['Sport', 'Énergie', 'Motivation'],
  },
  {
    slug: 'evening-wind',
    name: 'Détente Soir',
    description: 'Transition douce vers la relaxation',
    icon: 'moon',
    gradient: 'from-indigo-500 to-purple-600',
    blend: { joy: 0.5, calm: 0.8, energy: 0.3, focus: 0.3 },
    tags: ['Soir', 'Détente', 'Relaxation'],
  },
  {
    slug: 'study-session',
    name: 'Session Étude',
    description: 'Concentration soutenue pour apprendre',
    icon: 'headphones',
    gradient: 'from-teal-500 to-blue-600',
    blend: { joy: 0.4, calm: 0.6, energy: 0.4, focus: 0.9 },
    tags: ['Étude', 'Apprentissage', 'Focus'],
  },
  {
    slug: 'coffee-break',
    name: 'Pause Café',
    description: 'Moment de détente et ressourcement',
    icon: 'coffee',
    gradient: 'from-amber-500 to-orange-500',
    blend: { joy: 0.7, calm: 0.5, energy: 0.6, focus: 0.5 },
    tags: ['Pause', 'Social', 'Ressourcement'],
  },
];

const DEFAULT_PRESET_CARDS: MoodPresetCard[] = DEFAULT_PRESETS.map((preset) => ({
  id: preset.slug,
  name: preset.name,
  description: preset.description,
  icon: ICON_MAP[preset.icon] ?? Sparkles,
  gradient: preset.gradient,
  blend: preset.blend,
  tags: preset.tags,
}));

const PresetSelector: React.FC<PresetSelectorProps> = ({
  onPresetSelect,
  currentBlend,
}) => {
  const [presets, setPresets] = useState<MoodPresetCard[]>(DEFAULT_PRESET_CARDS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPresets = async () => {
      try {
        const data = await moodPresetsService.listPresets();
        if (!isMounted) return;
        if (data.length > 0) {
          setPresets(data.map(mapRecordToCard));
        } else {
          setPresets(DEFAULT_PRESET_CARDS);
        }
      } catch (error) {
        console.error('Unable to load mood presets', error);
        if (isMounted) {
          setPresets(DEFAULT_PRESET_CARDS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPresets();

    return () => {
      isMounted = false;
    };
  }, []);

  const isCurrentPreset = (presetBlend: BlendState) => {
    return (
      Math.abs(presetBlend.joy - currentBlend.joy) < 0.1 &&
      Math.abs(presetBlend.calm - currentBlend.calm) < 0.1 &&
      Math.abs(presetBlend.energy - currentBlend.energy) < 0.1 &&
      Math.abs(presetBlend.focus - currentBlend.focus) < 0.1
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ambiances Prédéfinies</h2>
        <p className="text-muted-foreground">
          Choisissez une ambiance ou personnalisez vos réglages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {presets.map((preset, index) => {
          const IconComponent = preset.icon;
          const isCurrent = isCurrentPreset(preset.blend);

          return (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isCurrent ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => onPresetSelect(preset.blend)}
              >
                <CardHeader className="pb-3">
                  <div className="text-center space-y-2">
                    <div
                      className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${preset.gradient} flex items-center justify-center`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {preset.description}
                  </p>

                  {/* Blend Preview */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Joie</span>
                        <span>{Math.round(preset.blend.joy * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Calme</span>
                        <span>{Math.round(preset.blend.calm * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Énergie</span>
                        <span>{Math.round(preset.blend.energy * 100)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Focus</span>
                        <span>{Math.round(preset.blend.focus * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {preset.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant={isCurrent ? 'default' : 'outline'}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Chargement…' : isCurrent ? 'Sélectionné' : 'Appliquer'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetSelector;
