// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Save, 
  Sparkles,
  TrendingUp,
  Search,
  Download,
  Sun,
  Smile,
  Cloud,
  Moon,
  Brain,
  Clock,
  Loader2,
  Heart,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface JournalEntry {
  id: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'difficult';
  timestamp: Date;
  tags: string[];
  emotionAnalysis?: {
    emotion: string;
    confidence: number;
  };
}

interface InsightsData {
  summary: string;
  emotional_trends: Array<{
    emotion: string;
    frequency: string;
    observation: string;
    evolution: string;
  }>;
  behavioral_patterns: Array<{
    pattern: string;
    description: string;
    impact: string;
  }>;
  growth_areas: Array<{
    area: string;
    progress: string;
    suggestion: string;
  }>;
  key_moments: Array<{
    date: string;
    description: string;
    importance: string;
  }>;
  recommendations: string[];
  wellbeing_score: number;
  encouraging_message: string;
}

const JournalEnhanced: React.FC = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood'] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [insightsPeriod, setInsightsPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  const moods = [
    { 
      key: 'excellent' as const, 
      icon: Sun, 
      label: 'Excellent', 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      score: 10
    },
    { 
      key: 'good' as const, 
      icon: Smile, 
      label: 'Bien', 
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      score: 7
    },
    { 
      key: 'neutral' as const, 
      icon: Cloud, 
      label: 'Neutre', 
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      score: 5
    },
    { 
      key: 'difficult' as const, 
      icon: Moon, 
      label: 'Difficile', 
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      score: 3
    }
  ];

  useEffect(() => {
    loadRecentEntries();
  }, []);

  const loadRecentEntries = async () => {
    // Mock data - à remplacer par appel Supabase
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        content: 'Journée productive au travail. Je me sens accompli et serein.',
        mood: 'excellent',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tags: ['productivité', 'travail', 'accomplissement']
      },
      {
        id: '2',
        content: 'Petite anxiété avant la présentation, mais tout s\'est bien passé.',
        mood: 'good',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        tags: ['anxiété', 'présentation', 'réussite']
      },
      {
        id: '3',
        content: 'Journée difficile, beaucoup de pression au travail.',
        mood: 'difficult',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        tags: ['stress', 'travail', 'pression']
      }
    ];
    setRecentEntries(mockEntries);
  };

  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('journal-insights', {
        body: { period: insightsPeriod, limit: 30 }
      });

      if (error) throw error;

      if (data?.success && data?.data?.insights) {
        setInsights(data.data.insights);
        toast.success('Insights générés avec succès');
      }
    } catch (error) {
      logger.error('Error loading insights', error as Error, 'UI');
      toast.error('Impossible de charger les insights');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!currentEntry.trim() || !selectedMood) return;

    setIsAnalyzing(true);
    setIsSaving(true);
    
    try {
      // Analyse avec l'edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'journal-analysis',
        { body: { entry: currentEntry, analysis_type: 'comprehensive' } }
      );

      if (analysisError) throw analysisError;

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        mood: selectedMood,
        timestamp: new Date(),
        tags: ['manuel'],
        emotionAnalysis: analysisData?.data?.emotional_analysis?.primary_emotions?.[0]
          ? {
              emotion: analysisData.data.emotional_analysis.primary_emotions[0].name,
              confidence: analysisData.data.emotional_analysis.primary_emotions[0].intensity / 10
            }
          : undefined
      };

      setRecentEntries(prev => [newEntry, ...prev]);
      setCurrentEntry('');
      setSelectedMood(null);
      toast.success('Entrée sauvegardée avec succès');
    } catch (error) {
      logger.error('Error saving entry', error as Error, 'UI');
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  const exportEntries = () => {
    const exportData = recentEntries.map(entry => ({
      date: entry.timestamp.toISOString(),
      mood: entry.mood,
      content: entry.content,
      tags: entry.tags.join(', ')
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Export réalisé avec succès');
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  const filteredEntries = recentEntries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Préparer les données pour le graphique d'évolution
  const chartData = {
    labels: recentEntries.slice(0, 7).reverse().map(e => 
      new Date(e.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Humeur',
        data: recentEntries.slice(0, 7).reverse().map(e => 
          moods.find(m => m.key === e.mood)?.score || 5
        ),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { color: 'hsl(var(--border) / 0.2)' }
      },
      x: {
        ticks: { color: 'hsl(var(--muted-foreground))' },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write" className="gap-2">
            <FileText className="h-4 w-4" />
            Écrire
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Onglet Écrire */}
        <TabsContent value="write" className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Nouvelle Entrée de Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Comment vous sentez-vous ?</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {moods.map((mood) => (
                    <Button
                      key={mood.key}
                      variant={selectedMood === mood.key ? 'default' : 'outline'}
                      onClick={() => setSelectedMood(mood.key)}
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <mood.icon className={`h-6 w-6 ${selectedMood === mood.key ? '' : mood.color}`} />
                      <div className="text-xs">{mood.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="Exprimez vos pensées, sentiments, réflexions... L'IA analysera vos émotions."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                className="min-h-32 resize-none"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  {currentEntry.length} caractères
                </div>
                <Button 
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.trim() || !selectedMood || isAnalyzing || isSaving}
                  className="gap-2"
                >
                  {isAnalyzing || isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isAnalyzing ? 'Analyse...' : 'Sauvegarde...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Évolution récente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Évolution de l'humeur (7 derniers jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Historique ({filteredEntries.length})
                </CardTitle>
                <Button variant="outline" size="sm" onClick={exportEntries} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans vos entrées..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredEntries.map((entry, index) => {
                    const moodInfo = moods.find(m => m.key === entry.mood);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            {moodInfo && (
                              <div className={`p-2 rounded-full ${moodInfo.bgColor}`}>
                                <moodInfo.icon className={`h-4 w-4 ${moodInfo.color}`} />
                              </div>
                            )}
                            <Badge variant="outline">{moodInfo?.label}</Badge>
                            {entry.emotionAnalysis && (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                {entry.emotionAnalysis.emotion}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(entry.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed mb-3">
                          {entry.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Insights & Analyse IA
                </span>
                <div className="flex gap-2">
                  <select
                    value={insightsPeriod}
                    onChange={(e) => setInsightsPeriod(e.target.value as any)}
                    className="text-sm border rounded-md px-3 py-1"
                  >
                    <option value="week">7 jours</option>
                    <option value="month">30 jours</option>
                    <option value="quarter">90 jours</option>
                  </select>
                  <Button onClick={loadInsights} disabled={isLoadingInsights} size="sm">
                    {isLoadingInsights ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Générer'
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {insights ? (
                <>
                  {/* Score de bien-être */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Score de bien-être</span>
                      <span className="text-2xl font-bold text-primary">{insights.wellbeing_score}/10</span>
                    </div>
                    <Progress value={insights.wellbeing_score * 10} className="h-2" />
                  </div>

                  {/* Résumé */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Résumé de la période
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insights.summary}
                    </p>
                  </div>

                  {/* Message encourageant */}
                  <div className="p-4 rounded-lg bg-accent/50 border-l-4 border-primary">
                    <p className="text-sm italic">{insights.encouraging_message}</p>
                  </div>

                  {/* Tendances émotionnelles */}
                  {insights.emotional_trends && insights.emotional_trends.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Tendances émotionnelles
                      </h3>
                      <div className="grid gap-3">
                        {insights.emotional_trends.map((trend, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{trend.emotion}</span>
                              <Badge variant={trend.evolution === 'amélioration' ? 'default' : 'secondary'}>
                                {trend.frequency}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{trend.observation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Domaines de croissance */}
                  {insights.growth_areas && insights.growth_areas.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-500" />
                        Domaines de croissance
                      </h3>
                      <div className="grid gap-3">
                        {insights.growth_areas.map((area, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <h4 className="font-medium text-sm mb-1">{area.area}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{area.progress}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">💡 {area.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommandations */}
                  {insights.recommendations && insights.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Recommandations
                      </h3>
                      <ul className="space-y-2">
                        {insights.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Cliquez sur "Générer" pour obtenir une analyse détaillée de vos entrées de journal
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalEnhanced;
