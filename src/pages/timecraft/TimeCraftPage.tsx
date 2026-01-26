/**
 * TimeCraftPage - Module de design du temps personnel (B2C)
 * Visualisation du temps comme architecture, pas comme to-do list
 */

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Palette,
  Layers,
  GitCompare,
  Brain,
  Plus,
  BarChart3,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageSEO } from '@/hooks/usePageSEO';

// Hooks TIMECRAFT
import {
  useTimeBlocks,
  useTimeVersions,
  useTimeInsights,
  useTimeEmotionCorrelation,
  type TimeBlock,
  type CreateTimeBlockInput,
} from '@/hooks/timecraft';

// Composants TIMECRAFT
import { WeekGrid } from '@/components/timecraft/WeekGrid';
import { TimeStats } from '@/components/timecraft/TimeStats';
import { TimeBlockEditor } from '@/components/timecraft/TimeBlockEditor';
import { InsightsList } from '@/components/timecraft/InsightCard';
import { VersionSelector } from '@/components/timecraft/VersionSelector';
import { EmotionCorrelationChart } from '@/components/timecraft/EmotionCorrelationChart';

export default function TimeCraftPage() {
  const [activeTab, setActiveTab] = useState('map');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [defaultDay, setDefaultDay] = useState(1);
  const [defaultHour, setDefaultHour] = useState(9);

  // Hooks
  const {
    blocks,
    blocksByDay,
    stats,
    isLoading: blocksLoading,
    createBlock,
    updateBlock,
    deleteBlock,
    isCreating,
  } = useTimeBlocks();

  const {
    versions,
    activeVersion,
    createVersion,
    setActiveVersion,
    duplicateVersion,
    deleteVersion,
    isCreating: versionCreating,
  } = useTimeVersions();

 const { insights } = useTimeInsights();

  const {
    correlations,
    dayPatterns,
    emotionDataCount,
    hasData: hasCorrelationData,
    isLoading: correlationLoading,
  } = useTimeEmotionCorrelation();

  usePageSEO({
    title: 'TimeCraft - Design du temps personnel | EmotionsCare',
    description: 'Visualisez et architecturez votre temps. Comprenez vos rythmes émotionnels et énergétiques.',
  });

  // Handlers
  const handleAddBlock = useCallback((day: number, hour: number) => {
    setEditingBlock(null);
    setDefaultDay(day);
    setDefaultHour(hour);
    setEditorOpen(true);
  }, []);

  const handleEditBlock = useCallback((block: TimeBlock) => {
    setEditingBlock(block);
    setEditorOpen(true);
  }, []);

  const handleSaveBlock = useCallback(async (data: CreateTimeBlockInput) => {
    if (editingBlock) {
      await updateBlock({ id: editingBlock.id, ...data });
    } else {
      await createBlock(data);
    }
  }, [editingBlock, createBlock, updateBlock]);

  const handleDeleteBlock = useCallback(async (id: string) => {
    await deleteBlock(id);
  }, [deleteBlock]);

  const isLoading = blocksLoading || correlationLoading;

  return (
    <main className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">TimeCraft</h1>
                <Badge variant="secondary">Beta</Badge>
              </div>
              <p className="text-muted-foreground">
                Architecturez votre temps. Comprenez vos rythmes.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab('versions')}>
                <GitCompare className="h-4 w-4 mr-2" />
                Comparer
              </Button>
              <Button size="sm" onClick={() => handleAddBlock(1, 9)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau bloc
              </Button>
            </div>
          </div>

          {/* Disclaimer non-médical */}
          <Alert className="border-muted bg-muted/30">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              TimeCraft est un outil de <strong>lucidité personnelle</strong>, pas un diagnostic. 
              Il montre, il ne juge pas. Aucune injonction à la performance.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TimeStats stats={stats} compact />
        </motion.div>

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="map">
              <Palette className="h-4 w-4 mr-2" />
              Cartographie
            </TabsTrigger>
            <TabsTrigger value="blocks">
              <Layers className="h-4 w-4 mr-2" />
              Blocs
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Brain className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="versions">
              <GitCompare className="h-4 w-4 mr-2" />
              Versions
            </TabsTrigger>
          </TabsList>

          {/* Cartographie temporelle */}
          <TabsContent value="map" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-2">Chargement...</p>
                  </CardContent>
                </Card>
              ) : (
                <WeekGrid
                  blocks={blocks}
                  blocksByDay={blocksByDay}
                  onAddBlock={handleAddBlock}
                  onEditBlock={handleEditBlock}
                  onDeleteBlock={handleDeleteBlock}
                />
              )}

              {/* Corrélation émotions */}
              <EmotionCorrelationChart
                correlations={correlations}
                dayPatterns={dayPatterns}
                emotionDataCount={emotionDataCount}
                hasData={hasCorrelationData}
                isLoading={correlationLoading}
              />
            </motion.div>
          </TabsContent>

          {/* Liste des blocs */}
          <TabsContent value="blocks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes blocs temporels</CardTitle>
                <CardDescription>
                  Gérez vos différents types de temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {blocks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun bloc créé pour le moment</p>
                    <Button className="mt-4" variant="outline" onClick={() => handleAddBlock(1, 9)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier bloc
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <TimeStats stats={stats} />
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {blocks.map((block) => (
                        <Card
                          key={block.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleEditBlock(block)}
                        >
                          <CardContent className="p-4">
                            <div className="font-medium">{block.label || block.block_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][block.day_of_week]} • {block.start_hour}h-{block.start_hour + block.duration_hours}h
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Insights temporels
                </CardTitle>
                <CardDescription>
                  Observations non-prescriptives sur votre structure temporelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InsightsList 
                  insights={insights} 
                  emptyMessage="Les insights apparaîtront une fois vos blocs créés"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Versions */}
          <TabsContent value="versions" className="space-y-4">
            <VersionSelector
              versions={versions}
              activeVersion={activeVersion}
              onSetActive={setActiveVersion}
              onCreate={createVersion}
              onDuplicate={duplicateVersion}
              onDelete={deleteVersion}
              isLoading={versionCreating}
            />
          </TabsContent>
        </Tabs>

        {/* Lien vers données émotionnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Corrélation émotions ↔ temps</h3>
                  <p className="text-sm text-muted-foreground">
                    {emotionDataCount > 0 
                      ? `${emotionDataCount} scans émotionnels connectés`
                      : 'Connectez vos données émotionnelles pour plus d\'insights'
                    }
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('map')}>
                Voir les corrélations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Block Editor Dialog */}
      <TimeBlockEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        block={editingBlock}
        defaultDay={defaultDay}
        defaultHour={defaultHour}
        onSave={handleSaveBlock}
        isLoading={isCreating}
      />
    </main>
  );
}
