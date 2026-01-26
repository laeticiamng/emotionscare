/**
 * Page principale du module Discovery
 * @module discovery
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  LayoutGrid, 
  Map, 
  Trophy, 
  Settings,
  Search,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { useDiscovery } from '../hooks/useDiscovery';
import { DiscoveryCard } from '../components/DiscoveryCard';
import { DiscoveryStatsPanel } from '../components/DiscoveryStats';
import { DiscoveryFiltersPanel } from '../components/DiscoveryFilters';
import { DiscoveryPathsPanel } from '../components/DiscoveryPaths';
import { DiscoveryRecommendationsPanel } from '../components/DiscoveryRecommendations';
import { DiscoverySessionPanel } from '../components/DiscoverySession';
import { DiscoveryAchievementsPanel } from '../components/DiscoveryAchievements';

export function DiscoveryPage() {
  const {
    items,
    allItems,
    paths,
    stats,
    recommendations,
    currentSession,
    settings,
    filters,
    isLoading,
    startSession,
    completeSession,
    cancelSession,
    updateFilters,
    resetFilters,
  } = useDiscovery();

  const [activeTab, setActiveTab] = useState('explore');
  const currentItem = currentSession 
    ? allItems.find(i => i.id === currentSession.itemId) 
    : undefined;

  const handleSelectPath = (pathId: string) => {
    // Filtrer les items du parcours sélectionné
    const path = paths.find(p => p.id === pathId);
    if (path) {
      // On pourrait appliquer un filtre spécifique ici
      setActiveTab('explore');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Compass className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Découverte</h1>
                <p className="text-sm text-muted-foreground">
                  Explorez de nouvelles facettes émotionnelles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="explore" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Explorer</span>
            </TabsTrigger>
            <TabsTrigger value="paths" className="gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Parcours</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Succès</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Explorer Tab */}
          <TabsContent value="explore" className="space-y-6">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Recommandations */}
                <DiscoveryRecommendationsPanel
                  recommendations={recommendations}
                  onStartItem={startSession}
                />

                {/* Filtres */}
                <DiscoveryFiltersPanel
                  filters={filters}
                  onUpdateFilters={updateFilters}
                  onReset={resetFilters}
                />

                {/* Grid des découvertes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Toutes les découvertes
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {items.length} résultat{items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item, index) => (
                      <DiscoveryCard
                        key={item.id}
                        item={item}
                        onStart={startSession}
                        index={index}
                      />
                    ))}
                  </div>

                  {items.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Compass className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Aucune découverte trouvée
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Essayez de modifier vos filtres
                      </p>
                      <Button variant="outline" onClick={resetFilters}>
                        Réinitialiser les filtres
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sidebar - Stats */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <DiscoveryStatsPanel 
                    stats={stats} 
                    dailyGoal={settings.dailyGoal} 
                  />
                </div>
              </aside>
            </div>
          </TabsContent>

          {/* Parcours Tab */}
          <TabsContent value="paths">
            <DiscoveryPathsPanel 
              paths={paths} 
              onSelectPath={handleSelectPath}
            />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <DiscoveryAchievementsPanel 
              achievements={stats.achievements} 
            />
          </TabsContent>

          {/* Stats Tab (Mobile) */}
          <TabsContent value="stats" className="lg:hidden">
            <DiscoveryStatsPanel 
              stats={stats} 
              dailyGoal={settings.dailyGoal} 
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Active Session Panel */}
      <DiscoverySessionPanel
        session={currentSession}
        item={currentItem}
        onComplete={completeSession}
        onCancel={cancelSession}
      />
    </div>
  );
}

export default DiscoveryPage;
