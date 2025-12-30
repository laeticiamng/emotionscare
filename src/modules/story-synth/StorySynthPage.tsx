/**
 * Page Story Synth enrichie avec design moderne
 * @module story-synth
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  PenTool, 
  Library, 
  BarChart3, 
  Sparkles,
  Settings
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';
import { useStorySynth } from '@/hooks/useStorySynth';
import { synthParagraphs } from '@/lib/story-synth/templates';
import { downloadText } from '@/lib/story-synth/export';

import { StoryGeneratorForm, type StoryGenerationFormData } from './components/StoryGeneratorForm';
import { StoryReader } from './components/StoryReader';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryStats } from './components/StoryStats';
import type { StoryContent, StorySynthStats } from './types';

export default function StorySynthPage() {
  const { user } = useAuth();
  const { history, createStory, isLoading, isSavingStory } = useStorySynth(user?.id || '');
  
  const [activeTab, setActiveTab] = useState('create');
  const [currentStory, setCurrentStory] = useState<StoryContent | null>(null);
  const [currentConfig, setCurrentConfig] = useState<StoryGenerationFormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // Mock stats (would come from service)
  const stats: StorySynthStats = {
    total_stories_read: history?.length || 0,
    total_reading_time_minutes: history?.reduce((sum: number, s: any) => 
      sum + Math.round((s.reading_duration_seconds || 0) / 60), 0) || 0,
    favorite_theme: 'calme',
    favorite_tone: 'apaisant',
    completion_rate: history?.length ? 
      history.filter((s: any) => s.completed_at).length / history.length : 0,
  };

  const handleGenerate = useCallback((config: StoryGenerationFormData) => {
    setIsGenerating(true);
    setCurrentConfig(config);

    try {
      // Generate story using templates
      const paragraphs = synthParagraphs({
        genre: config.theme,
        pov: config.pov,
        hero: config.protagonist,
        place: config.location,
        length: config.length,
        style: config.style,
        seed: config.seed,
      });

      const story: StoryContent = {
        title: `${config.protagonist} et ${config.location}`,
        paragraphs: paragraphs.map((text, i) => ({
          id: `p-${i}`,
          text,
          emphasis: i === 0 ? 'strong' : i === paragraphs.length - 1 ? 'soft' : 'normal',
        })),
        estimated_duration_seconds: paragraphs.length * 8,
        ambient_music: config.ambient !== 'aucun' ? config.ambient : undefined,
      };

      setCurrentStory(story);
      setIsReading(true);
      toast.success('Histoire générée !');
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleCompleteReading = useCallback((duration: number) => {
    setIsReading(false);
    
    if (currentStory && user?.id) {
      const content = currentStory.paragraphs.map(p => p.text).join('\n\n');
      
      createStory({
        title: currentStory.title,
        content,
        genre: currentConfig?.theme || 'calme',
        style: currentConfig?.style || 'sobre',
        metadata: { ...currentConfig, reading_duration: duration },
      });
    }

    toast.success(`Lecture terminée ! ${Math.round(duration / 60)} min de lecture.`);
  }, [currentStory, currentConfig, user?.id, createStory]);

  const handleSaveStory = useCallback(() => {
    if (!currentStory || !user?.id) return;
    
    const content = currentStory.paragraphs.map(p => p.text).join('\n\n');
    
    createStory({
      title: currentStory.title,
      content,
      genre: currentConfig?.theme || 'calme',
      style: currentConfig?.style || 'sobre',
      metadata: currentConfig,
    });
  }, [currentStory, currentConfig, user?.id, createStory]);

  const handleExportStory = useCallback(() => {
    if (!currentStory) return;
    
    const filename = `${currentStory.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    const content = currentStory.paragraphs.map(p => p.text);
    downloadText(filename, content);
    toast.success('Histoire exportée !');
  }, [currentStory]);

  const handleReadStory = useCallback((storyId: string) => {
    // In a real app, this would fetch the story from the backend
    const story = history?.find((s: any) => s.id === storyId);
    if (story) {
      // Convert stored story to StoryContent format
      setCurrentStory({
        title: story.theme || 'Histoire',
        paragraphs: [{
          id: 'p-0',
          text: 'Cette histoire sera chargée depuis votre bibliothèque...',
          emphasis: 'normal',
        }],
      });
      setIsReading(true);
    }
  }, [history]);

  const handleDeleteStory = useCallback((storyId: string) => {
    toast.info('Suppression non implémentée dans cette démo');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Story Synth Lab</h1>
                <p className="text-sm text-muted-foreground">
                  Créez des histoires thérapeutiques personnalisées
                </p>
              </div>
            </div>

            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="create" className="gap-2">
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">Créer</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2">
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Bibliothèque</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* Generator Form */}
              <StoryGeneratorForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              {/* Stats Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <StoryStats 
                    stats={stats}
                    weeklyGoal={3}
                    weeklyProgress={history?.filter((s: any) => {
                      const date = new Date(s.created_at);
                      const now = new Date();
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return date >= weekAgo;
                    }).length || 0}
                  />
                </div>
              </aside>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <StoryLibrary
              stories={history || []}
              isLoading={isLoading}
              onReadStory={handleReadStory}
              onDeleteStory={handleDeleteStory}
              onExportStory={(id) => toast.info('Export depuis bibliothèque à implémenter')}
              onToggleFavorite={(id) => toast.info('Favoris à implémenter')}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="lg:hidden">
            <StoryStats 
              stats={stats}
              weeklyGoal={3}
              weeklyProgress={history?.filter((s: any) => {
                const date = new Date(s.created_at);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= weekAgo;
              }).length || 0}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Story Reader Overlay */}
      <AnimatePresence>
        {isReading && currentStory && (
          <StoryReader
            story={currentStory}
            title={currentStory.title}
            theme={currentConfig?.theme}
            onClose={() => setIsReading(false)}
            onComplete={handleCompleteReading}
            onSave={handleSaveStory}
            onExport={handleExportStory}
            ambient={currentConfig?.ambient}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
