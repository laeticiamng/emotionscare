/**
 * SoundLibrary - Bibliothèque de sons pour le Mood Mixer
 */

import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Plus, Music, Trees, Building, Moon, Zap, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Sound {
  id: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  isPremium?: boolean;
}

interface SoundLibraryProps {
  onAddSound: (sound: Sound) => void;
  activeSoundIds: string[];
  className?: string;
}

const SOUND_CATEGORIES = [
  { id: 'all', label: 'Tous', icon: <Headphones className="h-4 w-4" /> },
  { id: 'nature', label: 'Nature', icon: <Trees className="h-4 w-4" /> },
  { id: 'urban', label: 'Urbain', icon: <Building className="h-4 w-4" /> },
  { id: 'focus', label: 'Focus', icon: <Zap className="h-4 w-4" /> },
  { id: 'sleep', label: 'Sommeil', icon: <Moon className="h-4 w-4" /> },
  { id: 'music', label: 'Musicaux', icon: <Music className="h-4 w-4" /> },
];

const AVAILABLE_SOUNDS: Sound[] = [
  // Nature
  { id: 'rain', name: 'Pluie douce', icon: '🌧️', category: 'nature', color: '#4299E1' },
  { id: 'thunder', name: 'Orage lointain', icon: '⛈️', category: 'nature', color: '#5A67D8' },
  { id: 'ocean', name: 'Vagues océan', icon: '🌊', category: 'nature', color: '#0BC5EA' },
  { id: 'river', name: 'Ruisseau', icon: '💧', category: 'nature', color: '#38B2AC' },
  { id: 'forest', name: 'Forêt', icon: '🌲', category: 'nature', color: '#48BB78' },
  { id: 'birds', name: 'Oiseaux', icon: '🐦', category: 'nature', color: '#F6AD55' },
  { id: 'wind', name: 'Vent léger', icon: '🍃', category: 'nature', color: '#68D391' },
  { id: 'fire', name: 'Feu de camp', icon: '🔥', category: 'nature', color: '#ED8936' },
  
  // Urban
  { id: 'cafe', name: 'Café animé', icon: '☕', category: 'urban', color: '#A0522D' },
  { id: 'library', name: 'Bibliothèque', icon: '📚', category: 'urban', color: '#8B4513' },
  { id: 'train', name: 'Train', icon: '🚂', category: 'urban', color: '#718096' },
  { id: 'keyboard', name: 'Clavier', icon: '⌨️', category: 'urban', color: '#4A5568' },
  
  // Focus
  { id: 'white-noise', name: 'Bruit blanc', icon: '📻', category: 'focus', color: '#CBD5E0' },
  { id: 'pink-noise', name: 'Bruit rose', icon: '🎀', category: 'focus', color: '#FBB6CE' },
  { id: 'brown-noise', name: 'Bruit brun', icon: '🟤', category: 'focus', color: '#B7791F' },
  { id: 'binaural', name: 'Battements binauraux', icon: '🧠', category: 'focus', color: '#9F7AEA', isPremium: true },
  
  // Sleep
  { id: 'crickets', name: 'Grillons', icon: '🦗', category: 'sleep', color: '#553C9A' },
  { id: 'night-forest', name: 'Forêt nocturne', icon: '🌙', category: 'sleep', color: '#2D3748' },
  { id: 'fan', name: 'Ventilateur', icon: '🌀', category: 'sleep', color: '#90CDF4' },
  { id: 'heartbeat', name: 'Battement cœur', icon: '❤️', category: 'sleep', color: '#FC8181' },
  
  // Music
  { id: 'piano', name: 'Piano doux', icon: '🎹', category: 'music', color: '#1A202C', isPremium: true },
  { id: 'guitar', name: 'Guitare acoustique', icon: '🎸', category: 'music', color: '#DD6B20', isPremium: true },
  { id: 'singing-bowls', name: 'Bols tibétains', icon: '🔔', category: 'music', color: '#B7791F' },
  { id: 'drone', name: 'Drone ambient', icon: '🎧', category: 'music', color: '#667EEA', isPremium: true },
];

export const SoundLibrary = memo<SoundLibraryProps>(({
  onAddSound,
  activeSoundIds,
  className,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredSounds = useMemo(() => {
    return AVAILABLE_SOUNDS.filter(sound => {
      const matchesSearch = sound.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || sound.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5" />
          Bibliothèque de sons
        </CardTitle>
        
        {/* Recherche */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un son..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Catégories */}
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="w-full h-auto flex-wrap gap-1 p-1">
            {SOUND_CATEGORIES.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="flex-1 min-w-[60px] text-xs gap-1"
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Grille de sons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
          <AnimatePresence>
            {filteredSounds.map((sound, i) => {
              const isActive = activeSoundIds.includes(sound.id);
              
              return (
                <motion.button
                  key={sound.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !isActive && onAddSound(sound)}
                  disabled={isActive}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all relative group",
                    isActive
                      ? "bg-primary/10 border-primary/30 cursor-default"
                      : "hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  {sound.isPremium && (
                    <Badge 
                      className="absolute -top-1 -right-1 text-[10px] px-1"
                      variant="secondary"
                    >
                      PRO
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-hidden="true">
                      {sound.icon}
                    </span>
                    <span className="text-sm font-medium truncate flex-1">
                      {sound.name}
                    </span>
                  </div>
                  
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredSounds.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucun son trouvé
          </p>
        )}
      </CardContent>
    </Card>
  );
});

SoundLibrary.displayName = 'SoundLibrary';

export default SoundLibrary;
