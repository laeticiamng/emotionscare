/**
 * RegionInfoPanel - Panneau d'informations sur la région sélectionnée
 */

import React, { memo, useMemo } from 'react';
import { 
  Brain, 
  Activity, 
  Info, 
  Ruler, 
  Tag,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AALRegion, BrainRegion, EmotionRegionMap } from './types';
import { AAL_REGIONS, EMOTION_BRAIN_MAPPING } from './types';

// ============================================================================
// Types
// ============================================================================

interface RegionInfoPanelProps {
  selectedRegionCode?: string | null;
  regionData?: BrainRegion | null;
  emotionOverlay?: EmotionRegionMap;
  onClose?: () => void;
}

// ============================================================================
// Data
// ============================================================================

const REGION_DESCRIPTIONS: Record<string, { description: string; functions: string[] }> = {
  'Amygdala': {
    description: "L'amygdale est une structure du système limbique impliquée dans le traitement des émotions, en particulier la peur et l'anxiété.",
    functions: ['Traitement de la peur', 'Conditionnement émotionnel', 'Réponse au stress', 'Mémoire émotionnelle'],
  },
  'Hippocampus': {
    description: "L'hippocampe joue un rôle crucial dans la formation de nouveaux souvenirs et la navigation spatiale.",
    functions: ['Mémoire déclarative', 'Navigation spatiale', 'Consolidation mémoire', 'Régulation du stress'],
  },
  'Prefrontal': {
    description: "Le cortex préfrontal est impliqué dans les fonctions exécutives, la prise de décision et la régulation émotionnelle.",
    functions: ['Fonctions exécutives', 'Prise de décision', 'Régulation émotionnelle', 'Planification'],
  },
  'Insula': {
    description: "L'insula traite les signaux intéroceptifs et joue un rôle dans la conscience de soi et les émotions.",
    functions: ['Intéroception', 'Conscience de soi', 'Dégoût', 'Empathie'],
  },
  'ACC': {
    description: "Le cortex cingulaire antérieur est impliqué dans la détection des conflits, la gestion des erreurs et la prise de décision.",
    functions: ['Détection de conflits', 'Gestion des erreurs', 'Attention', 'Motivation'],
  },
  'Nucleus_Accumbens': {
    description: "Le noyau accumbens fait partie du circuit de la récompense et est impliqué dans la motivation et le plaisir.",
    functions: ['Circuit de récompense', 'Motivation', 'Addiction', 'Plaisir'],
  },
  'Hypothalamus': {
    description: "L'hypothalamus régule les fonctions autonomes, les hormones et les comportements de base.",
    functions: ['Régulation hormonale', 'Température corporelle', 'Faim/soif', 'Rythmes circadiens'],
  },
  'Thalamus': {
    description: "Le thalamus sert de relais pour presque toutes les informations sensorielles vers le cortex.",
    functions: ['Relais sensoriel', 'Conscience', 'Sommeil', 'Attention'],
  },
  'Caudate': {
    description: "Le noyau caudé est impliqué dans l'apprentissage procédural et le contrôle moteur.",
    functions: ['Apprentissage procédural', 'Contrôle moteur', 'Mémoire de travail', 'Habitudes'],
  },
  'Putamen': {
    description: "Le putamen joue un rôle dans le contrôle moteur et l'apprentissage par renforcement.",
    functions: ['Contrôle moteur', 'Apprentissage moteur', 'Renforcement', 'Coordination'],
  },
  'Cerebellum': {
    description: "Le cervelet coordonne les mouvements, l'équilibre et joue un rôle dans certaines fonctions cognitives.",
    functions: ['Coordination motrice', 'Équilibre', 'Apprentissage moteur', 'Timing'],
  },
};

// ============================================================================
// Composant
// ============================================================================

export const RegionInfoPanel: React.FC<RegionInfoPanelProps> = memo(({
  selectedRegionCode,
  regionData,
  emotionOverlay,
  onClose,
}) => {
  // Trouver la région AAL
  const aalRegion = useMemo(() => {
    if (!selectedRegionCode) return null;
    return AAL_REGIONS.find(r => r.code === selectedRegionCode);
  }, [selectedRegionCode]);

  // Obtenir les informations de la région
  const regionInfo = useMemo(() => {
    if (!aalRegion) return null;
    
    // Chercher la description basée sur le nom
    const baseName = aalRegion.name.replace(/[LR]$/, '').trim();
    for (const [key, info] of Object.entries(REGION_DESCRIPTIONS)) {
      if (baseName.includes(key) || key.includes(baseName) || aalRegion.code.includes(key)) {
        return info;
      }
    }
    return null;
  }, [aalRegion]);

  // Émotions associées à cette région
  const associatedEmotions = useMemo(() => {
    if (!aalRegion) return [];
    
    const emotions: { name: string; color: string; intensity?: number }[] = [];
    
    // Vérifier les affinités de la région
    if (aalRegion.emotionAffinity) {
      aalRegion.emotionAffinity.forEach(e => {
        const mapping = EMOTION_BRAIN_MAPPING[e];
        const overlayData = emotionOverlay?.[e];
        emotions.push({
          name: e.charAt(0).toUpperCase() + e.slice(1),
          color: mapping?.color || '#888',
          intensity: overlayData?.intensity,
        });
      });
    }
    
    // Vérifier aussi le mapping inverse
    Object.entries(EMOTION_BRAIN_MAPPING).forEach(([emotion, data]) => {
      const regionMatch = data.regions.some(r => 
        aalRegion.name.includes(r) || aalRegion.code.includes(r)
      );
      if (regionMatch && !emotions.find(e => e.name.toLowerCase() === emotion)) {
        const overlayData = emotionOverlay?.[emotion];
        emotions.push({
          name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          color: data.color,
          intensity: overlayData?.intensity,
        });
      }
    });
    
    return emotions;
  }, [aalRegion, emotionOverlay]);

  if (!selectedRegionCode || !aalRegion) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center">
          <Brain className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            Sélectionnez une région cérébrale pour afficher ses informations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: aalRegion.color }}
            />
            <CardTitle className="text-base">{aalRegion.name}</CardTitle>
          </div>
          <Badge variant="outline">
            {aalRegion.hemisphere === 'left' ? 'Gauche' :
             aalRegion.hemisphere === 'right' ? 'Droite' : 'Bilatéral'}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-4">
          {/* Code de région */}
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Code:</span>
            <code className="bg-muted px-2 py-0.5 rounded text-xs">
              {aalRegion.code}
            </code>
          </div>

          {/* Description */}
          {regionInfo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Description</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {regionInfo.description}
              </p>
            </div>
          )}

          {/* Fonctions */}
          {regionInfo?.functions && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Fonctions principales</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {regionInfo.functions.map((fn) => (
                  <Badge key={fn} variant="secondary" className="text-xs">
                    {fn}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Volume si disponible */}
          {regionData?.volume_mm3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Volume</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {regionData.volume_mm3.toLocaleString()} mm³
              </p>
            </div>
          )}

          <Separator />

          {/* Émotions associées */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Affinités émotionnelles</span>
            </div>
            
            {associatedEmotions.length > 0 ? (
              <div className="space-y-2">
                {associatedEmotions.map((emotion) => (
                  <div
                    key={emotion.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: emotion.color }}
                      />
                      <span className="text-sm">{emotion.name}</span>
                    </div>
                    {emotion.intensity !== undefined && (
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: emotion.color,
                          color: emotion.color,
                        }}
                      >
                        {Math.round(emotion.intensity * 100)}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune affinité émotionnelle connue
              </p>
            )}
          </div>

          {/* Lien vers plus d'infos */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => {
              const searchTerm = aalRegion.name.replace(/\s+/g, '+');
              window.open(
                `https://en.wikipedia.org/wiki/${searchTerm}`,
                '_blank',
                'noopener,noreferrer'
              );
            }}
          >
            <BookOpen className="h-4 w-4" />
            En savoir plus
            <ExternalLink className="h-3 w-3" />
          </Button>
        </CardContent>
      </ScrollArea>
    </Card>
  );
});

RegionInfoPanel.displayName = 'RegionInfoPanel';

export default RegionInfoPanel;
