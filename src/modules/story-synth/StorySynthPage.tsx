/**
 * Page Story Synth enrichie avec toutes les fonctionnalités
 * @module story-synth
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  PenTool, 
  Library, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';
import { useStorySynthEnriched } from './useStorySynthEnriched';

import { StoryGeneratorForm, type StoryGenerationFormData } from './components/StoryGeneratorForm';
import { StoryReader } from './components/StoryReader';
import { StoryLibrary } from './components/StoryLibrary';
import { StoryStats } from './components/StoryStats';

export default function StorySynthPage() {
  const { user } = useAuth();
  const {
    sessions,
    stats,
    achievements,
    weeklyProgress,
    streak,
    currentStory,
    currentConfig,
    isReading,
    isGenerating,
    isLoadingHistory,
    readingStartTime,
    generateStory,
    completeReading,
    saveCurrentStory,
    exportStory,
    readFromLibrary,
    closeReader,
    deleteSession,
    toggleFavorite,
  } = useStorySynthEnriched(user?.id);

  const [activeTab, setActiveTab] = useState('create');

  // Transform sessions for StoryLibrary component
  const libraryStories = sessions.map(s => ({
    id: s.id,
    title: s.story_theme || s.theme || 'Histoire',
    theme: s.theme || undefined,
    tone: s.tone || undefined,
    reading_duration_seconds: s.reading_duration_seconds || s.duration_seconds || 0,
    created_at: s.created_at,
    completed_at: s.completed_at || undefined,
    is_favorite: s.is_favorite,
  }));

  const handleGenerate = (config: StoryGenerationFormData) => {
    generateStory({
      theme: config.theme,
      tone: config.tone,
      pov: config.pov,
      style: config.style,
      protagonist: config.protagonist,
      location: config.location,
      length: config.length,
      seed: config.seed,
      userContext: config.userContext,
      ambient: config.ambient,
    });
  };

  const handleCompleteReading = (duration: number) => {
    completeReading(duration);
  };

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

            <div className="flex items-center gap-2">
              {streak > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium">
                  🔥 {streak} jour{streak > 1 ? 's' : ''}
                </div>
              )}
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-6">
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
                    weeklyProgress={weeklyProgress}
                  />
                </div>
              </aside>
            </div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <StoryLibrary
              stories={libraryStories}
              isLoading={isLoadingHistory}
              onReadStory={readFromLibrary}
              onDeleteStory={deleteSession}
              onExportStory={exportStory}
              onToggleFavorite={toggleFavorite}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="max-w-md mx-auto lg:max-w-none lg:grid lg:grid-cols-2 gap-6">
              <StoryStats 
                stats={stats}
                weeklyGoal={3}
                weeklyProgress={weeklyProgress}
              />
              
              {/* Extended achievements panel */}
              <div className="mt-6 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    🏆 Tous les succès
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {achievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={cn(
                          'p-4 rounded-lg border text-center transition-all',
                          achievement.unlocked
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-muted/50 border-border opacity-50 grayscale'
                        )}
                      >
                        <span className="text-2xl block mb-2">{achievement.icon}</span>
                        <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
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
            onClose={closeReader}
            onComplete={handleCompleteReading}
            onSave={saveCurrentStory}
            onExport={() => exportStory()}
            ambient={currentConfig?.ambient}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
