/**
 * Page SEUIL - Module de régulation émotionnelle proactive
 * Version enrichie avec persistance, export CSV/JSON, favoris, mode compact
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Waves, History, BarChart3, Calendar, Settings, Download, FileJson, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { 
  SeuilModule, 
  SeuilTriggerButton, 
  SeuilStats, 
  SeuilTrendChart,
  SeuilCalendar,
  SeuilInsightsPanel,
  SeuilSettings,
  SeuilHistoryItem
} from '@/modules/seuil/components';
import { useTodaySeuilEvents, useSeuilEvents, useSeuilSettings, useSeuilExport } from '@/modules/seuil/hooks';

const SeuilPage: React.FC = () => {
  const [showModule, setShowModule] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { data: todayEvents } = useTodaySeuilEvents();
  const { data: allEvents } = useSeuilEvents();
  const { data: settings } = useSeuilSettings();
  const { exportJSON, exportCSV } = useSeuilExport();

  // Apply settings
  const showInsights = settings?.showInsights !== false;
  const showTrends = settings?.showTrends !== false;
  const compactMode = settings?.compactMode === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500/5 via-background to-rose-500/5 p-4 md:p-6">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/app/emotional-park">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au Parc
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                {!compactMode && 'Exporter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportJSON} className="gap-2">
                <FileJson className="w-4 h-4" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportCSV} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className={`max-w-4xl mx-auto ${compactMode ? 'space-y-4' : 'space-y-8'}`}>
        {/* Header */}
        {!compactMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/30 to-rose-500/30 flex items-center justify-center"
            >
              <Waves className="w-10 h-10 text-amber-500" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Seuil</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Le moment fragile où tout peut encore être rattrapé sans violence mentale
            </p>
          </motion.div>
        )}

        {/* Compact header */}
        {compactMode && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-rose-500/30 flex items-center justify-center">
              <Waves className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold">Seuil</h1>
          </div>
        )}

        {/* Main trigger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SeuilTriggerButton onClick={() => setShowModule(true)} variant={compactMode ? 'compact' : 'default'} />
        </motion.div>

        {/* Insights Panel - conditional */}
        {showInsights && <SeuilInsightsPanel compact={compactMode} />}

        {/* Stats */}
        <SeuilStats />

        {/* Tabs: Tendances / Calendrier / Historique */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {!compactMode && 'Tendances'}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              {!compactMode && 'Calendrier'}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              {!compactMode && 'Historique'}
            </TabsTrigger>
          </TabsList>

          {/* Trends Tab - conditional */}
          <TabsContent value="trends" className="mt-4">
            {showTrends ? <SeuilTrendChart /> : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Les tendances sont masquées. Active-les dans les paramètres.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <SeuilCalendar />
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            {/* Today's events with SeuilHistoryItem */}
            {todayEvents && todayEvents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Aujourd'hui ({todayEvents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {todayEvents.map((event) => (
                    <SeuilHistoryItem key={event.id} event={event} showDetails />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* All history with SeuilHistoryItem */}
            {allEvents && allEvents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    Historique récent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {allEvents.slice(0, 20).map((event) => (
                    <SeuilHistoryItem key={event.id} event={event} />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {(!allEvents || allEvents.length === 0) && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Waves className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    Aucun historique pour l'instant
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty state global */}
        {(!allEvents || allEvents.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <Waves className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Aucun signal enregistré pour l'instant.
              <br />
              Clique sur "Ça commence" quand tu sens un décalage.
            </p>
          </motion.div>
        )}

        {/* Philosophy - hidden in compact mode */}
        {!compactMode && (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                "Le module SEUIL est un outil de lucidité émotionnelle.
                <br />
                Il aide à reconnaître un état, pas à le combattre."
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Module */}
      {showModule && <SeuilModule onClose={() => setShowModule(false)} />}

      {/* Modal Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Paramètres SEUIL
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <SeuilSettings onSave={() => setShowSettings(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SeuilPage;
