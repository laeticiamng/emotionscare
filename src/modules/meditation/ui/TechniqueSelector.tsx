/**
 * TechniqueSelector - Sélecteur de technique de méditation enrichi
 * Features: Favoris persistants, niveaux de difficulté, durées recommandées, animations
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Brain, Eye, Heart, Wind, Sparkles, Music, Star, Clock, Zap, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { MeditationTechnique } from '../types';
import { techniqueLables, techniqueDescriptions } from '../types';

const techniqueIcons: Record<MeditationTechnique, React.ComponentType<{ className?: string }>> = {
  'mindfulness': Brain,
  'body-scan': Eye,
  'loving-kindness': Heart,
  'breath-focus': Wind,
  'visualization': Sparkles,
  'mantra': Music,
};

type DifficultyLevel = 'débutant' | 'intermédiaire' | 'avancé';

interface TechniqueMetadata {
  difficulty: DifficultyLevel;
  recommendedDuration: number; // en minutes
  benefits: string[];
  bestFor: string;
}

const techniqueMetadata: Record<MeditationTechnique, TechniqueMetadata> = {
  'mindfulness': {
    difficulty: 'débutant',
    recommendedDuration: 10,
    benefits: ['Réduction du stress', 'Clarté mentale', 'Présence'],
    bestFor: 'Quotidien, pause travail',
  },
  'body-scan': {
    difficulty: 'débutant',
    recommendedDuration: 15,
    benefits: ['Relaxation profonde', 'Conscience corporelle', 'Détente musculaire'],
    bestFor: 'Avant de dormir, tension',
  },
  'loving-kindness': {
    difficulty: 'intermédiaire',
    recommendedDuration: 20,
    benefits: ['Compassion', 'Relations harmonieuses', 'Bien-être émotionnel'],
    bestFor: 'Conflits, empathie',
  },
  'breath-focus': {
    difficulty: 'débutant',
    recommendedDuration: 5,
    benefits: ['Calme instantané', 'Ancrage', 'Régulation émotionnelle'],
    bestFor: 'Stress immédiat, anxiété',
  },
  'visualization': {
    difficulty: 'intermédiaire',
    recommendedDuration: 15,
    benefits: ['Créativité', 'Motivation', 'Objectifs'],
    bestFor: 'Performance, créativité',
  },
  'mantra': {
    difficulty: 'avancé',
    recommendedDuration: 20,
    benefits: ['Concentration profonde', 'États méditatifs', 'Spiritualité'],
    bestFor: 'Pratique avancée',
  },
};

const difficultyColors: Record<DifficultyLevel, string> = {
  'débutant': 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  'intermédiaire': 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  'avancé': 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
};

const FAVORITES_KEY = 'meditation-technique-favorites';

interface TechniqueSelectorProps {
  selected: MeditationTechnique;
  onSelect: (technique: MeditationTechnique) => void;
  showDetails?: boolean;
  filterByDifficulty?: DifficultyLevel | null;
}

export function TechniqueSelector({ 
  selected, 
  onSelect, 
  showDetails = true,
  filterByDifficulty = null 
}: TechniqueSelectorProps) {
  const [favorites, setFavorites] = useState<MeditationTechnique[]>([]);
  const [activeFilter, setActiveFilter] = useState<DifficultyLevel | 'favorites' | null>(filterByDifficulty);
  const [hoveredTechnique, setHoveredTechnique] = useState<MeditationTechnique | null>(null);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (technique: MeditationTechnique, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(technique)
      ? favorites.filter(f => f !== technique)
      : [...favorites, technique];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const techniques = Object.keys(techniqueLables) as MeditationTechnique[];
  
  const filteredTechniques = techniques.filter(technique => {
    if (activeFilter === 'favorites') return favorites.includes(technique);
    if (activeFilter) return techniqueMetadata[technique].difficulty === activeFilter;
    return true;
  });

  // Trier: favoris en premier
  const sortedTechniques = [...filteredTechniques].sort((a, b) => {
    const aFav = favorites.includes(a) ? 0 : 1;
    const bFav = favorites.includes(b) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter(null)}
          className="gap-1"
        >
          <Filter className="h-3 w-3" />
          Tous
        </Button>
        <Button
          variant={activeFilter === 'favorites' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('favorites')}
          className="gap-1"
          disabled={favorites.length === 0}
        >
          <Star className="h-3 w-3" />
          Favoris ({favorites.length})
        </Button>
        {(['débutant', 'intermédiaire', 'avancé'] as DifficultyLevel[]).map(level => (
          <Button
            key={level}
            variant={activeFilter === level ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(level)}
            className="capitalize"
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Grille des techniques */}
      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {sortedTechniques.map((technique) => {
              const Icon = techniqueIcons[technique];
              const isSelected = selected === technique;
              const isFavorite = favorites.includes(technique);
              const metadata = techniqueMetadata[technique];
              const isHovered = hoveredTechnique === technique;

              return (
                <motion.div
                  key={technique}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => onSelect(technique)}
                        onMouseEnter={() => setHoveredTechnique(technique)}
                        onMouseLeave={() => setHoveredTechnique(null)}
                        className={cn(
                          'h-auto w-full p-4 flex-col gap-2 relative overflow-hidden transition-all duration-300',
                          isSelected && 'border-primary ring-2 ring-primary/20',
                          isFavorite && !isSelected && 'border-amber-400/50',
                          isHovered && 'shadow-lg'
                        )}
                      >
                        {/* Bouton favori */}
                        <button
                          onClick={(e) => toggleFavorite(technique, e)}
                          className={cn(
                            'absolute top-2 right-2 p-1 rounded-full transition-all',
                            isFavorite 
                              ? 'text-amber-500 hover:text-amber-600' 
                              : 'text-muted-foreground/40 hover:text-muted-foreground'
                          )}
                          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                        </button>

                        {/* Icône avec animation */}
                        <motion.div
                          animate={{ 
                            scale: isSelected ? 1.1 : 1,
                            rotate: isHovered ? [0, -5, 5, 0] : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className={cn(
                            'h-8 w-8 transition-colors',
                            isSelected ? 'text-primary-foreground' : 'text-primary'
                          )} />
                        </motion.div>

                        {/* Nom et description */}
                        <div className="text-center space-y-1">
                          <div className="font-semibold text-sm">{techniqueLables[technique]}</div>
                          {showDetails && (
                            <div className="text-xs opacity-80 line-clamp-2">
                              {techniqueDescriptions[technique]}
                            </div>
                          )}
                        </div>

                        {/* Badges */}
                        {showDetails && (
                          <div className="flex flex-wrap gap-1 justify-center mt-1">
                            <Badge 
                              variant="secondary" 
                              className={cn('text-[10px] px-1.5 py-0', difficultyColors[metadata.difficulty])}
                            >
                              <Zap className="h-2.5 w-2.5 mr-0.5" />
                              {metadata.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              <Clock className="h-2.5 w-2.5 mr-0.5" />
                              {metadata.recommendedDuration}min
                            </Badge>
                          </div>
                        )}

                        {/* Effet de brillance au survol */}
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold">{techniqueLables[technique]}</p>
                        <p className="text-sm text-muted-foreground">{metadata.bestFor}</p>
                        <div className="flex flex-wrap gap-1">
                          {metadata.benefits.map((benefit, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </TooltipProvider>

      {/* Message si aucun résultat */}
      {sortedTechniques.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune technique ne correspond aux filtres.</p>
          <Button 
            variant="link" 
            onClick={() => setActiveFilter(null)}
            className="mt-2"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
