/**
 * Galerie des artefacts Ambition Arcade
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Gem, Crown, Star, Sparkles } from 'lucide-react';
import { useAmbitionArtifacts } from '../hooks/useAmbitionExtras';

const RARITY_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  common: { 
    color: 'bg-muted text-muted-foreground border-muted-foreground/20', 
    icon: <Star className="w-4 h-4" />,
    label: 'Commun'
  },
  rare: { 
    color: 'bg-info/20 text-info border-info/30', 
    icon: <Gem className="w-4 h-4" />,
    label: 'Rare'
  },
  epic: { 
    color: 'bg-primary/20 text-primary border-primary/30', 
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Épique'
  },
  legendary: { 
    color: 'bg-warning/20 text-warning border-warning/30', 
    icon: <Crown className="w-4 h-4" />,
    label: 'Légendaire'
  },
};

interface ArtifactGalleryProps {
  runId: string;
  compact?: boolean;
}

export const ArtifactGallery: React.FC<ArtifactGalleryProps> = ({ runId, compact = false }) => {
  const { data: artifacts, isLoading } = useAmbitionArtifacts(runId);

  if (isLoading) {
    return compact ? (
      <div className="flex gap-2">
        {[1, 2].map(i => <Skeleton key={i} className="w-10 h-10 rounded-lg" />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  if (!artifacts || artifacts.length === 0) {
    if (compact) return null;
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Gem className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aucun artefact obtenu</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {artifacts.slice(0, 5).map((artifact, index) => {
          const config = RARITY_CONFIG[artifact.rarity || 'common'];
          return (
            <motion.div
              key={artifact.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${config.color} border`}
              title={`${artifact.name} (${config.label})`}
            >
              {artifact.icon || '🏆'}
            </motion.div>
          );
        })}
        {artifacts.length > 5 && (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
            +{artifacts.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {artifacts.map((artifact, index) => {
        const config = RARITY_CONFIG[artifact.rarity || 'common'];
        return (
          <motion.div
            key={artifact.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`${config.color} border overflow-hidden`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{artifact.icon || '🏆'}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{artifact.name}</h4>
                    {artifact.description && (
                      <p className="text-xs opacity-80 truncate">{artifact.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      {config.icon}
                      <span className="text-xs">{config.label}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ArtifactGallery;
