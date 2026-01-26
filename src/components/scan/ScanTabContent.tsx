import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EmotionResult } from '@/types';
import EmotionScanForm from './EmotionScanForm';
import UnifiedEmotionCheckin from './UnifiedEmotionCheckin';
import { 
  Camera, Mic, MessageSquare, Smile, TrendingUp, Clock, 
  Calendar, BarChart3, Share2, Download, Filter, Star, 
  Sparkles, History, Target, Award, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useScanSettings, type ScanStats } from '@/hooks/useScanSettings';

interface ScanTabContentProps {
  showScanForm: boolean;
  setShowScanForm: (show: boolean) => void;
  onScanComplete: (result: EmotionResult) => void;
}

const SCAN_METHODS = [
  { id: 'text', label: 'Texte', icon: MessageSquare, description: 'Décrivez vos émotions' },
  { id: 'emoji', label: 'Emoji', icon: Smile, description: 'Choisissez des emojis' },
  { id: 'voice', label: 'Vocal', icon: Mic, description: 'Parlez de vos émotions', premium: true },
  { id: 'face', label: 'Visage', icon: Camera, description: 'Analyse faciale', premium: true },
];

const ScanTabContent: React.FC<ScanTabContentProps> = ({
  showScanForm,
  setShowScanForm,
  onScanComplete
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'scan' | 'stats' | 'history'>('scan');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [filterMethod, setFilterMethod] = useState<string | null>(null);

  // Use Supabase-backed settings instead of localStorage
  const {
    stats,
    history,
    favoriteMethods,
    isLoading,
    updateStats,
    addHistoryEntry
  } = useScanSettings();

  // Show loading state while fetching from Supabase
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleScanComplete = (result: EmotionResult) => {
    // Calculate new stats
    const newStats: Partial<ScanStats> = {
      totalScans: stats.totalScans + 1,
      scansByMethod: {
        ...stats.scansByMethod,
        [selectedMethod || 'text']: (stats.scansByMethod[selectedMethod || 'text'] || 0) + 1
      },
      lastScanDate: new Date().toISOString(),
      weeklyProgress: stats.weeklyProgress + 1
    };
    
    // Calculate streak
    if (stats.lastScanDate) {
      const lastDate = new Date(stats.lastScanDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        newStats.streakDays = stats.streakDays + (diffDays === 1 ? 1 : 0);
      } else {
        newStats.streakDays = 1;
      }
    } else {
      newStats.streakDays = 1;
    }

    // Update via hook (saves to Supabase)
    updateStats(newStats);

    // Add to history via hook (saves to Supabase)
    addHistoryEntry({
      date: new Date().toISOString(),
      method: selectedMethod || 'text',
      emotion: result.emotion || 'neutral',
      score: result.intensity ?? result.confidence ?? 50
    });

    onScanComplete(result);
    setShowScanForm(false);
    setSelectedMethod(null);
  };

  const exportHistory = () => {
    const data = history.map(h => ({
      date: new Date(h.date).toLocaleString('fr-FR'),
      method: SCAN_METHODS.find(m => m.id === h.method)?.label || h.method,
      emotion: h.emotion,
      score: h.score
    }));
    
    const csv = [
      ['Date', 'Méthode', 'Émotion', 'Score'].join(','),
      ...data.map(d => [d.date, d.method, d.emotion, d.score].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-scans-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast({ title: 'Export réussi', description: 'Historique exporté en CSV' });
  };

  const handleShare = async () => {
    const text = `📊 Mon suivi émotionnel EmotionsCare :\n• ${stats.totalScans} scans réalisés\n• Série de ${stats.streakDays} jours\n• Objectif hebdo: ${stats.weeklyProgress}/${stats.weeklyGoal}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !' });
    }
  };

  const filteredHistory = filterMethod 
    ? history.filter(h => h.method === filterMethod)
    : history;

  // Most used method
  const mostUsedMethod = Object.entries(stats.scansByMethod)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partager</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={exportHistory}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exporter</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Scan Tab */}
          <TabsContent value="scan" className="space-y-6">
            {/* Quick stats banner */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-3"
            >
              <Card className="p-3 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-2xl font-bold">{stats.totalScans}</div>
                <div className="text-xs text-muted-foreground">Scans totaux</div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-orange-500/10 to-amber-500/5">
                <div className="text-2xl font-bold flex items-center gap-1">
                  {stats.streakDays}
                  {stats.streakDays >= 3 && <span className="text-orange-500">🔥</span>}
                </div>
                <div className="text-xs text-muted-foreground">Jours consécutifs</div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                <div className="text-2xl font-bold">{stats.weeklyProgress}/{stats.weeklyGoal}</div>
                <div className="text-xs text-muted-foreground">Objectif semaine</div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                <div className="text-2xl font-bold">
                  {mostUsedMethod ? SCAN_METHODS.find(m => m.id === mostUsedMethod[0])?.icon && '📊' : '-'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mostUsedMethod ? SCAN_METHODS.find(m => m.id === mostUsedMethod[0])?.label : 'Méthode'}
                </div>
              </Card>
            </motion.div>

            {!showScanForm ? (
              <div className="space-y-4">
                {/* Method selection */}
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Choisissez une méthode d'analyse
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SCAN_METHODS.map((method) => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all hover:shadow-md relative ${
                            selectedMethod === method.id ? 'ring-2 ring-primary' : ''
                          } ${method.premium ? 'opacity-80' : ''}`}
                          onClick={() => !method.premium && setSelectedMethod(method.id)}
                        >
                          <CardContent className="p-4 text-center">
                            {favoriteMethods.includes(method.id) && (
                              <Star className="absolute top-2 right-2 h-4 w-4 fill-amber-400 text-amber-400" />
                            )}
                            <method.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <div className="font-medium">{method.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {method.description}
                            </div>
                            {method.premium && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                Premium
                              </Badge>
                            )}
                            {stats.scansByMethod[method.id] && (
                              <div className="text-xs text-muted-foreground mt-2">
                                {stats.scansByMethod[method.id]} utilisations
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Start scan button */}
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowScanForm(true)}
                    className="flex-1"
                    size="lg"
                    disabled={!selectedMethod && !favoriteMethods.length}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {selectedMethod ? `Commencer (${SCAN_METHODS.find(m => m.id === selectedMethod)?.label})` : 'Nouvelle analyse'}
                  </Button>
                </div>

                {/* Unified checkin */}
                <UnifiedEmotionCheckin />
              </div>
            ) : (
              <EmotionScanForm 
                onComplete={handleScanComplete} 
                onClose={() => {
                  setShowScanForm(false);
                  setSelectedMethod(null);
                }} 
              />
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Weekly progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Progression hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{stats.weeklyProgress} scans</span>
                      <span>Objectif: {stats.weeklyGoal}</span>
                    </div>
                    <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} />
                    {stats.weeklyProgress >= stats.weeklyGoal && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Award className="h-3 w-3" />
                        Objectif atteint !
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Methods breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Méthodes utilisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {SCAN_METHODS.map((method) => {
                      const count = stats.scansByMethod[method.id] || 0;
                      const percentage = stats.totalScans > 0 ? (count / stats.totalScans) * 100 : 0;
                      return (
                        <div key={method.id} className="flex items-center gap-2">
                          <method.icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{method.label}</span>
                              <span>{count}</span>
                            </div>
                            <Progress value={percentage} className="h-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Série en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-500 flex items-center justify-center gap-2">
                      {stats.streakDays}
                      {stats.streakDays >= 7 && <span>🔥</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">jours consécutifs</div>
                    {stats.streakDays > 0 && (
                      <div className="mt-2 text-xs">
                        {stats.streakDays >= 7 ? 'Incroyable !' : stats.streakDays >= 3 ? 'Continuez !' : 'Bon début !'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Total */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Total des analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{stats.totalScans}</div>
                    <div className="text-sm text-muted-foreground">scans réalisés</div>
                    {stats.lastScanDate && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Dernier: {new Date(stats.lastScanDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4" />
                Historique des scans ({filteredHistory.length})
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterMethod ? SCAN_METHODS.find(m => m.id === filterMethod)?.label : 'Filtrer'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterMethod(null)}>
                    Tous
                  </DropdownMenuItem>
                  {SCAN_METHODS.map((method) => (
                    <DropdownMenuItem 
                      key={method.id}
                      onClick={() => setFilterMethod(method.id)}
                    >
                      <method.icon className="h-4 w-4 mr-2" />
                      {method.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {filteredHistory.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun scan dans l'historique</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('scan')}
                >
                  Faire un scan
                </Button>
              </Card>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredHistory.map((item, index) => {
                  const method = SCAN_METHODS.find(m => m.id === item.method);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-3">
                        <div className="flex items-center gap-3">
                          {method && <method.icon className="h-5 w-5 text-muted-foreground" />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">{item.emotion}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.score}%
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString('fr-FR')}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {method?.label}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default ScanTabContent;
