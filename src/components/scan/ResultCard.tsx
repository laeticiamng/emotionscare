// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Smile, Frown, Meh, Zap, Loader2, Share2, Heart, History,
  TrendingUp, TrendingDown, Minus, Music, BookOpen, Wind,
  Sparkles, Download, Copy, ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type ScanBucket = 'positif' | 'calme' | 'neutre' | 'tendu';

export interface ScanResult {
  bucket: ScanBucket;
  label: string;
  advice?: string;
  confidence?: number;
  emotions?: { name: string; score: number }[];
  timestamp?: Date;
}

interface ResultCardProps {
  loading: boolean;
  result: ScanResult | null;
  onRecommendation?: (type: string) => void;
}

interface ScanHistoryEntry {
  id: string;
  bucket: ScanBucket;
  label: string;
  confidence: number;
  timestamp: Date;
  isFavorite: boolean;
}

const STORAGE_KEY = 'scan-result-history';

const bucketConfig = {
  positif: {
    icon: Smile,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-300 dark:border-green-700',
    recommendations: [
      { type: 'music', label: 'Musique énergisante', icon: Music },
      { type: 'journal', label: 'Capturer ce moment', icon: BookOpen },
    ]
  },
  calme: {
    icon: Smile,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-300 dark:border-blue-700',
    recommendations: [
      { type: 'meditation', label: 'Méditation guidée', icon: Sparkles },
      { type: 'music', label: 'Musique ambient', icon: Music },
    ]
  },
  neutre: {
    icon: Meh,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    gradient: 'from-gray-500/10 to-slate-500/10',
    borderColor: 'border-gray-300 dark:border-gray-700',
    recommendations: [
      { type: 'breathing', label: 'Exercice de respiration', icon: Wind },
      { type: 'journal', label: 'Écrire ses pensées', icon: BookOpen },
    ]
  },
  tendu: {
    icon: Frown,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-300 dark:border-amber-700',
    recommendations: [
      { type: 'breathing', label: 'Cohérence cardiaque', icon: Wind },
      { type: 'music', label: 'Musique relaxante', icon: Music },
    ]
  }
};

const bucketOrder: ScanBucket[] = ['tendu', 'neutre', 'calme', 'positif'];

export const ResultCard: React.FC<ResultCardProps> = ({
  loading,
  result,
  onRecommendation
}) => {
  const [activeTab, setActiveTab] = useState('result');
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save result to history
  useEffect(() => {
    if (result) {
      const newEntry: ScanHistoryEntry = {
        id: Date.now().toString(),
        bucket: result.bucket,
        label: result.label,
        confidence: result.confidence || 0,
        timestamp: new Date(),
        isFavorite: false,
      };
      
      setHistory(prev => {
        const updated = [newEntry, ...prev.slice(0, 49)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      // Show confetti for positive results
      if (result.bucket === 'positif' && (result.confidence || 0) > 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [result]);

  // Calculate trend
  const getTrend = () => {
    if (history.length < 2) return 'stable';
    const current = bucketOrder.indexOf(result?.bucket || 'neutre');
    const previous = bucketOrder.indexOf(history[1]?.bucket || 'neutre');
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => {
      const updated = prev.map(h => 
        h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleShare = async () => {
    if (!result) return;
    
    const text = `Mon scan émotionnel: ${result.label}\nConfiance: ${Math.round((result.confidence || 0) * 100)}%\n\n#EmotionsCare`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mon scan émotionnel', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const handleExport = () => {
    const data = {
      result,
      history: history.slice(0, 20),
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Historique exporté');
  };

  // Calculate stats
  const stats = {
    total: history.length,
    positif: history.filter(h => h.bucket === 'positif').length,
    averageConfidence: history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.confidence, 0) / history.length * 100)
      : 0,
    favorites: history.filter(h => h.isFavorite).length,
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold">Analyse en cours...</h3>
              <p className="text-sm text-muted-foreground">
                L'IA analyse vos données émotionnelles
              </p>
            </div>
            <Progress value={75} className="w-full max-w-xs mx-auto" />
            
            {/* Fun loading messages */}
            <motion.div
              key={Math.random()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              {['Détection des micro-expressions...', 'Analyse du contexte émotionnel...', 'Calibration de l\'algorithme...'][Math.floor(Math.random() * 3)]}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-8">
          <div className="text-center space-y-4 text-muted-foreground">
            <Zap className="w-16 h-16 mx-auto opacity-50" />
            <div>
              <h3 className="text-lg font-medium">En attente d'analyse</h3>
              <p className="text-sm">
                Sélectionnez une image ou activez la caméra pour commencer
              </p>
            </div>
            
            {/* Quick stats preview */}
            {history.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-xs mb-2">Vos derniers scans</p>
                <div className="flex justify-center gap-2">
                  {history.slice(0, 5).map((entry, i) => {
                    const entryConfig = bucketConfig[entry.bucket];
                    return (
                      <div
                        key={i}
                        className={cn('w-8 h-8 rounded-full flex items-center justify-center', entryConfig.bgColor)}
                      >
                        <entryConfig.icon className={cn('w-4 h-4', entryConfig.color)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = bucketConfig[result.bucket];
  const Icon = config.icon;
  const trend = getTrend();
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
              >
                {['🎉', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Card 
        className={cn(`bg-gradient-to-br ${config.gradient} border-2`, config.borderColor)}
        role="status"
        aria-live="polite"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="result" className="text-xs">Résultat</TabsTrigger>
                <TabsTrigger value="history" className="text-xs">Historique</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value="result" className="mt-0 space-y-4">
              {/* Main result display */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className={cn('w-20 h-20 rounded-full mx-auto flex items-center justify-center', config.bgColor)}
                >
                  <Icon className={cn('w-10 h-10', config.color)} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4"
                >
                  <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                    {result.label}
                    <Badge variant="outline" className={cn('gap-1', 
                      trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : ''
                    )}>
                      <TrendIcon className="h-3 w-3" />
                    </Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    État émotionnel détecté
                  </p>
                </motion.div>
              </div>

              {/* Confidence meter */}
              {result.confidence && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fiabilité de l'analyse</span>
                    <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2" />
                </div>
              )}

              {/* Emotions breakdown */}
              {result.emotions && result.emotions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Détail des émotions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {result.emotions.slice(0, 4).map((emotion, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                        <span className="text-sm flex-1">{emotion.name}</span>
                        <Progress value={emotion.score * 100} className="w-16 h-1.5" />
                        <span className="text-xs text-muted-foreground">{Math.round(emotion.score * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {result.advice && (
                <div className="p-3 bg-background/50 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm">{result.advice}</p>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommandations</h4>
                <div className="grid grid-cols-2 gap-2">
                  {config.recommendations.map((rec, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="justify-start gap-2 h-auto py-3"
                      onClick={() => onRecommendation?.(rec.type)}
                    >
                      <rec.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs">{rec.label}</span>
                      <ChevronRight className="h-3 w-3 ml-auto" />
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <ScrollArea className="h-64">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun historique</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((entry) => {
                      const entryConfig = bucketConfig[entry.bucket];
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
                        >
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', entryConfig.bgColor)}>
                            <entryConfig.icon className={cn('w-4 h-4', entryConfig.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{entry.label}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(entry.timestamp).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(entry.confidence * 100)}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(entry.id)}
                          >
                            <Heart className={cn('h-4 w-4', entry.isFavorite && 'fill-red-500 text-red-500')} />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
              
              {history.length > 0 && (
                <Button variant="outline" size="sm" className="w-full mt-3 gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Exporter l'historique
                </Button>
              )}
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-background/50">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Scans totaux</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <div className="text-2xl font-bold text-green-600">{stats.positif}</div>
                  <p className="text-xs text-muted-foreground">Scans positifs</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <div className="text-2xl font-bold text-purple-600">{stats.averageConfidence}%</div>
                  <p className="text-xs text-muted-foreground">Confiance moy.</p>
                </Card>
                <Card className="p-3 bg-background/50">
                  <div className="text-2xl font-bold text-red-500">{stats.favorites}</div>
                  <p className="text-xs text-muted-foreground">Favoris</p>
                </Card>
              </div>

              {/* Distribution chart */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Distribution des résultats</h4>
                {(['positif', 'calme', 'neutre', 'tendu'] as ScanBucket[]).map((bucket) => {
                  const count = history.filter(h => h.bucket === bucket).length;
                  const percentage = history.length > 0 ? (count / history.length) * 100 : 0;
                  const bucketConf = bucketConfig[bucket];
                  
                  return (
                    <div key={bucket} className="flex items-center gap-2">
                      <bucketConf.icon className={cn('h-4 w-4', bucketConf.color)} />
                      <span className="text-xs w-16 capitalize">{bucket}</span>
                      <Progress value={percentage} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground w-10">{Math.round(percentage)}%</span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};
