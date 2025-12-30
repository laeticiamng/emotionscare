import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Map, Download, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import PageRoot from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AtlasMap } from '../components/AtlasMap';
import { AtlasTimeline } from '../components/AtlasTimeline';
import { AtlasFilters } from '../components/AtlasFilters';
import { AtlasInsights } from '../components/AtlasInsights';
import { AtlasLegend } from '../components/AtlasLegend';
import type { AtlasData, AtlasFilter, AtlasInsight, EmotionNode } from '../types';
import { EMOTION_COLORS, EMOTION_CATEGORIES } from '../types';

// Données de démonstration
const generateMockData = (): AtlasData => {
  const emotions = [
    { emotion: 'joie', freq: 45 },
    { emotion: 'calme', freq: 38 },
    { emotion: 'anxiété', freq: 22 },
    { emotion: 'gratitude', freq: 18 },
    { emotion: 'tristesse', freq: 15 },
    { emotion: 'fierté', freq: 12 },
    { emotion: 'espoir', freq: 10 },
    { emotion: 'frustration', freq: 8 },
    { emotion: 'enthousiasme', freq: 7 },
    { emotion: 'mélancolie', freq: 5 },
  ];

  const nodes: EmotionNode[] = emotions.map((e, i) => {
    // Placement circulaire autour du centre
    const angle = (i / emotions.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 25 + Math.random() * 15;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    
    return {
      id: `node-${i}`,
      emotion: e.emotion,
      intensity: 40 + Math.random() * 50,
      frequency: e.freq,
      color: EMOTION_COLORS[e.emotion] || 'hsl(200, 50%, 50%)',
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
      size: 30 + (e.freq / 45) * 40,
      connections: []
    };
  });

  // Créer des connexions entre émotions similaires
  const connections = [
    { source: 'node-0', target: 'node-3', strength: 0.8 },
    { source: 'node-0', target: 'node-8', strength: 0.7 },
    { source: 'node-1', target: 'node-6', strength: 0.6 },
    { source: 'node-2', target: 'node-7', strength: 0.5 },
    { source: 'node-4', target: 'node-9', strength: 0.6 },
    { source: 'node-3', target: 'node-5', strength: 0.4 },
  ];

  return {
    nodes,
    connections,
    timeRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
    totalEntries: 156,
    dominantEmotion: 'joie'
  };
};

const generateMockInsights = (): AtlasInsight[] => [
  {
    id: 'ins-1',
    type: 'pattern',
    title: 'Pic de joie le week-end',
    description: 'Vos émotions positives augmentent de 35% les samedis et dimanches.',
    emotion: 'joie',
    severity: 'success',
    actionable: true
  },
  {
    id: 'ins-2',
    type: 'trend',
    title: 'Réduction de l\'anxiété',
    description: 'Votre niveau d\'anxiété a diminué de 20% ce mois-ci par rapport au précédent.',
    emotion: 'anxiété',
    severity: 'success',
    actionable: false
  },
  {
    id: 'ins-3',
    type: 'recommendation',
    title: 'Méditation recommandée',
    description: 'Basé sur vos patterns, essayez la méditation le matin pour renforcer le calme.',
    severity: 'info',
    actionable: true
  }
];

export const EmotionAtlasPage: React.FC = () => {
  usePageSEO({
    title: 'Atlas des Émotions - Cartographie émotionnelle',
    description: 'Explorez la cartographie interactive de votre univers émotionnel. Visualisez vos patterns émotionnels et découvrez des insights personnalisés.',
    keywords: 'atlas émotions, cartographie émotionnelle, visualisation émotions, patterns émotionnels'
  });

  const [selectedNode, setSelectedNode] = useState<EmotionNode | null>(null);
  const [filters, setFilters] = useState<AtlasFilter>({
    timeRange: 'month',
    minIntensity: 0,
    sources: ['scan', 'journal', 'voice', 'text'],
    categories: ['positive', 'neutral', 'negative']
  });

  const atlasData = useMemo(() => generateMockData(), []);
  const insights = useMemo(() => generateMockInsights(), []);

  // Filtrer les données
  const filteredData = useMemo((): AtlasData => {
    const filteredNodes = atlasData.nodes.filter((node) => {
      if (node.intensity < filters.minIntensity) return false;
      const category = EMOTION_CATEGORIES[node.emotion];
      if (category && !filters.categories.includes(category)) return false;
      return true;
    });

    const filteredConnections = atlasData.connections.filter(
      (conn) =>
        filteredNodes.some((n) => n.id === conn.source) &&
        filteredNodes.some((n) => n.id === conn.target)
    );

    return {
      ...atlasData,
      nodes: filteredNodes,
      connections: filteredConnections
    };
  }, [atlasData, filters]);

  const handleNodeSelect = useCallback((node: EmotionNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <PageRoot className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <Link to="/app/emotional-park">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Grid3X3 className="h-6 w-6 text-primary" />
                L'Atlas des Émotions
              </h1>
              <p className="text-sm text-muted-foreground">
                Cartographie interactive de votre univers émotionnel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        </motion.div>

        {/* Filtres */}
        <AtlasFilters filters={filters} onFiltersChange={setFilters} />

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Votre carte émotionnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AtlasMap
                  data={filteredData}
                  onNodeSelect={handleNodeSelect}
                  selectedNodeId={selectedNode?.id}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Panneau latéral */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Détails de l'émotion sélectionnée */}
            {selectedNode && (
              <Card className="border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <span className="capitalize">{selectedNode.emotion}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {Math.round(selectedNode.intensity)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Intensité moyenne</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {selectedNode.frequency}x
                      </div>
                      <div className="text-xs text-muted-foreground">Occurrences</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cette émotion représente{' '}
                    <strong>
                      {Math.round((selectedNode.frequency / atlasData.totalEntries) * 100)}%
                    </strong>{' '}
                    de vos entrées émotionnelles.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Légende */}
            <Card>
              <CardContent className="pt-4">
                <AtlasLegend
                  nodes={filteredData.nodes}
                  selectedNodeId={selectedNode?.id}
                  onNodeSelect={handleNodeSelect}
                />
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2">
                    <div className="text-xl font-bold text-primary">{atlasData.totalEntries}</div>
                    <div className="text-xs text-muted-foreground">Entrées totales</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-xl font-bold capitalize text-primary">
                      {atlasData.dominantEmotion}
                    </div>
                    <div className="text-xs text-muted-foreground">Émotion dominante</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Timeline et Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-4">
                <AtlasTimeline data={filteredData} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AtlasInsights insights={insights} />
          </motion.div>
        </div>
      </div>
    </PageRoot>
  );
};

export default EmotionAtlasPage;
