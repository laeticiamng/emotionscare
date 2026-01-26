import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  Star,
  Clock, 
  Play,
  Plus,
  Search,
  Zap,
  CloudRain,
  Moon,
  Focus
} from 'lucide-react';

export interface MoodPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'relax' | 'energy' | 'focus' | 'sleep' | 'creative' | 'custom';
  components: { id: string; name: string; value: number }[];
  duration: number;
  isBuiltIn: boolean;
  isFavorite: boolean;
  usageCount: number;
}

interface PresetsLibraryProps {
  presets: MoodPreset[];
  onSelectPreset: (preset: MoodPreset) => void;
  onToggleFavorite: (presetId: string) => void;
  onCreatePreset: () => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  relax: CloudRain,
  energy: Zap,
  focus: Focus,
  sleep: Moon,
  creative: Sparkles,
  custom: Star
};

const categoryLabels: Record<string, string> = {
  relax: 'Relaxation',
  energy: 'Énergie',
  focus: 'Concentration',
  sleep: 'Sommeil',
  creative: 'Créativité',
  custom: 'Personnalisé'
};

const categoryColors: Record<string, string> = {
  relax: 'from-blue-400 to-cyan-500',
  energy: 'from-orange-400 to-red-500',
  focus: 'from-purple-400 to-indigo-500',
  sleep: 'from-indigo-400 to-violet-500',
  creative: 'from-pink-400 to-rose-500',
  custom: 'from-emerald-400 to-teal-500'
};

const PresetsLibrary: React.FC<PresetsLibraryProps> = ({
  presets,
  onSelectPreset,
  onToggleFavorite,
  onCreatePreset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPresets = presets.filter((preset) => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoritePresets = filteredPresets.filter(p => p.isFavorite);
  const otherPresets = filteredPresets.filter(p => !p.isFavorite);

  const categories = ['relax', 'energy', 'focus', 'sleep', 'creative', 'custom'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Bibliothèque de Presets
          </CardTitle>
          <Button size="sm" onClick={onCreatePreset}>
            <Plus className="h-4 w-4 mr-1" />
            Nouveau
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un preset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </Button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                <Icon className="h-4 w-4 mr-1" />
                {categoryLabels[cat]}
              </Button>
            );
          })}
        </div>

        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {/* Favoris */}
            {favoritePresets.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Favoris
                </h4>
                <div className="grid gap-3">
                  {favoritePresets.map((preset, index) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      index={index}
                      onSelect={onSelectPreset}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Autres presets */}
            {otherPresets.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {favoritePresets.length > 0 ? 'Autres presets' : 'Tous les presets'}
                </h4>
                <div className="grid gap-3">
                  {otherPresets.map((preset, index) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      index={index}
                      onSelect={onSelectPreset}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredPresets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucun preset trouvé</p>
                <Button variant="link" onClick={onCreatePreset}>
                  Créer un nouveau preset
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface PresetCardProps {
  preset: MoodPreset;
  index: number;
  onSelect: (preset: MoodPreset) => void;
  onToggleFavorite: (presetId: string) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  index,
  onSelect,
  onToggleFavorite
}) => {
  const Icon = categoryIcons[preset.category];
  const gradientClass = categoryColors[preset.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group"
      onClick={() => onSelect(preset)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{preset.name}</span>
            {preset.isBuiltIn && (
              <Badge variant="secondary" className="text-xs">
                Intégré
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {preset.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {preset.duration} min
            </span>
            <span>{preset.usageCount} utilisations</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(preset.id);
            }}
          >
            <Star className={`h-4 w-4 ${preset.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PresetsLibrary;
