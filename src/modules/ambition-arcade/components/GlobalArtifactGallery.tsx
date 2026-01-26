/**
 * Galerie globale de tous les artefacts de l'utilisateur
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gem, Crown, Star, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Rarity = 'common' | 'rare' | 'epic' | 'legendary' | 'all';

const RARITY_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string; order: number }> = {
  common: { 
    color: 'bg-muted text-muted-foreground border-muted-foreground/20', 
    icon: <Star className="w-4 h-4" />,
    label: 'Commun',
    order: 1
  },
  rare: { 
    color: 'bg-info/20 text-info border-info/30', 
    icon: <Gem className="w-4 h-4" />,
    label: 'Rare',
    order: 2
  },
  epic: { 
    color: 'bg-primary/20 text-primary border-primary/30', 
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Épique',
    order: 3
  },
  legendary: { 
    color: 'bg-warning/20 text-warning border-warning/30', 
    icon: <Crown className="w-4 h-4" />,
    label: 'Légendaire',
    order: 4
  },
};

interface Artifact {
  id: string;
  name: string;
  description?: string;
  rarity: string;
  icon?: string;
  obtained_at: string;
  run_id: string;
  run_objective?: string;
}

export const GlobalArtifactGallery: React.FC = () => {
  const { user } = useAuth();
  const [filterRarity, setFilterRarity] = useState<Rarity>('all');

  const { data: artifacts, isLoading } = useQuery({
    queryKey: ['all-ambition-artifacts', user?.id],
    queryFn: async (): Promise<Artifact[]> => {
      if (!user?.id) return [];

      // Get runs for user
      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('id, objective')
        .eq('user_id', user.id);

      const runIds = runs?.map(r => r.id) || [];
      if (runIds.length === 0) return [];

      const runMap = new Map(runs?.map(r => [r.id, r.objective]) || []);

      // Get all artifacts
      const { data: artifactsData, error } = await supabase
        .from('ambition_artifacts')
        .select('*')
        .in('run_id', runIds)
        .order('obtained_at', { ascending: false });

      if (error) throw error;

      return (artifactsData || []).map(a => ({
        ...a,
        run_objective: runMap.get(a.run_id) || 'Objectif inconnu'
      }));
    },
    enabled: !!user?.id,
  });

  const filteredArtifacts = artifacts?.filter(a => 
    filterRarity === 'all' || a.rarity === filterRarity
  ) || [];

  // Group by rarity for stats
  const stats = artifacts?.reduce((acc, a) => {
    const rarity = a.rarity || 'common';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-primary" />
          Collection d'Artefacts
        </CardTitle>
        <CardDescription>
          {artifacts?.length || 0} artefacts collectés
        </CardDescription>
        
        {/* Stats */}
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(stats)
            .sort((a, b) => (RARITY_CONFIG[b[0]]?.order || 0) - (RARITY_CONFIG[a[0]]?.order || 0))
            .map(([rarity, count]) => {
              const config = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
              return (
                <Badge key={rarity} variant="outline" className={`gap-1 ${config.color}`}>
                  {config.icon}
                  {count} {config.label}
                </Badge>
              );
            })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter */}
        <Tabs value={filterRarity} onValueChange={(v) => setFilterRarity(v as Rarity)}>
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="all" className="text-xs h-7">Tous</TabsTrigger>
            <TabsTrigger value="legendary" className="text-xs h-7">👑</TabsTrigger>
            <TabsTrigger value="epic" className="text-xs h-7">✨</TabsTrigger>
            <TabsTrigger value="rare" className="text-xs h-7">💎</TabsTrigger>
            <TabsTrigger value="common" className="text-xs h-7">⭐</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gallery */}
        {filteredArtifacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Gem className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {filterRarity === 'all' 
                ? 'Aucun artefact collecté' 
                : `Aucun artefact ${RARITY_CONFIG[filterRarity]?.label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredArtifacts.map((artifact, index) => {
                const config = RARITY_CONFIG[artifact.rarity || 'common'];
                return (
                  <motion.div
                    key={artifact.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className={`${config.color} border overflow-hidden hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <motion.div 
                            className="text-3xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                          >
                            {artifact.icon || '🏆'}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{artifact.name}</h4>
                            {artifact.description && (
                              <p className="text-xs opacity-80 line-clamp-2">{artifact.description}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              {config.icon}
                              <span className="text-xs">{config.label}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 truncate">
                              {artifact.run_objective} • {format(new Date(artifact.obtained_at), 'd MMM', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalArtifactGallery;
