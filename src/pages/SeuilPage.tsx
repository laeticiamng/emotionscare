/**
 * Page SEUIL - Module de régulation émotionnelle proactive
 * Version enrichie avec persistance, export CSV/JSON, favoris
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Waves, History, TrendingUp, BarChart3, Calendar, Settings, Download, FileJson, FileSpreadsheet } from 'lucide-react';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SeuilPage: React.FC = () => {
  const [showModule, setShowModule] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { data: todayEvents } = useTodaySeuilEvents();
  const { data: allEvents } = useSeuilEvents();
  const { data: settings } = useSeuilSettings();
  const { exportJSON, exportCSV } = useSeuilExport();

  const zoneLabels = {
    low: { label: 'Basse', color: 'bg-emerald-500/20 text-emerald-600' },
    intermediate: { label: 'Intermédiaire', color: 'bg-amber-500/20 text-amber-600' },
    critical: { label: 'Critique', color: 'bg-rose-500/20 text-rose-600' },
    closure: { label: 'Clôture', color: 'bg-indigo-500/20 text-indigo-600' },
  };

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
                Exporter
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
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

        {/* Main trigger */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SeuilTriggerButton onClick={() => setShowModule(true)} variant="default" />
        </motion.div>

        {/* Insights Panel */}
        <SeuilInsightsPanel />

        {/* Stats */}
        <SeuilStats />

        {/* Tabs: Tendances / Calendrier / Historique */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Tendances
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="w-4 h-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-4">
            <SeuilTrendChart />
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <SeuilCalendar />
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            {/* Today's events */}
            {todayEvents && todayEvents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Aujourd'hui
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            event.zone === 'low' ? 'bg-emerald-500' :
                            event.zone === 'intermediate' ? 'bg-amber-500' :
                            event.zone === 'critical' ? 'bg-rose-500' : 'bg-indigo-500'
                          }`} />
                          <Badge className={zoneLabels[event.zone].color} variant="secondary">
                            {zoneLabels[event.zone].label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{event.thresholdLevel}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.createdAt), 'HH:mm', { locale: fr })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All history */}
            {allEvents && allEvents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    Historique récent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allEvents.slice(0, 15).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 text-sm border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <Badge className={zoneLabels[event.zone].color} variant="secondary">
                            {zoneLabels[event.zone].label}
                          </Badge>
                          {event.sessionCompleted && <span className="text-xs text-success">✓</span>}
                          {event.actionType && (
                            <span className="text-xs text-muted-foreground">{event.actionType}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.createdAt), 'd MMM HH:mm', { locale: fr })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty state */}
        {(!allEvents || allEvents.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Waves className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Aucun signal enregistré pour l'instant.
              <br />
              Clique sur "Ça commence" quand tu sens un décalage.
            </p>
          </motion.div>
        )}

        {/* Philosophy */}
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground italic">
              "Le module SEUIL est un outil de lucidité émotionnelle.
              <br />
              Il aide à reconnaître un état, pas à le combattre."
            </p>
          </CardContent>
        </Card>
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
