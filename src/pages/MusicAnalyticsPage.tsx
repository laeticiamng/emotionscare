/**
 * Music Analytics Page - Dashboard complet d'analytics musicales
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar,
  TrendingUp,
  Sparkles,
  Music,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MusicAnalyticsDashboard, MusicAnalyticsEnhanced } from '@/components/music/analytics';
import { useMusicPreferencesLearning } from '@/hooks/useMusicPreferencesLearning';
import { usePageSEO } from '@/hooks/usePageSEO';
import { logger } from '@/lib/logger';
import html2canvas from 'html2canvas';

const MusicAnalyticsPage: React.FC = () => {
  usePageSEO({
    title: 'Analytics Musicales | EmotionsCare',
    description: 'Visualisez vos statistiques d\'écoute et tendances musicales',
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { insights, isAnalyzing, isApplying, analyzePreferences, applyAdjustments } = useMusicPreferencesLearning();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      logger.info('Exporting analytics to PDF', undefined, 'MUSIC');

      const dashboardElement = document.getElementById('analytics-dashboard');
      if (!dashboardElement) {
        throw new Error('Dashboard element not found');
      }

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Télécharger comme image PNG
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `emotionscare-music-analytics-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imgData;
      link.click();

      toast({
        title: '✅ Export réussi',
        description: 'Vos statistiques ont été exportées en PNG',
      });

      logger.info('Image export successful', undefined, 'MUSIC');
    } catch (error) {
      logger.error('Failed to export image', error as Error, 'MUSIC');
      toast({
        title: '❌ Erreur d\'export',
        description: 'Impossible d\'exporter l\'image',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunLearning = async () => {
    await analyzePreferences();
    toast({
      title: '🧠 Apprentissage lancé',
      description: 'Vos préférences sont en cours d\'analyse',
    });
  };

  const handleApplyAdjustments = async () => {
    await applyAdjustments(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/app/music')}
                aria-label="Retour à la musique"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Music className="h-8 w-8 text-primary" />
                  Analytics Musicales
                </h1>
                <p className="text-muted-foreground mt-1">
                  Visualisez vos tendances et découvrez vos insights personnalisés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunLearning}
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser mes goûts'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Export...' : 'Export PNG'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div id="analytics-dashboard">
              <MusicAnalyticsDashboard />
            </div>
            {/* Vue enrichie avec données sessions */}
            <MusicAnalyticsEnhanced period={selectedPeriod} />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Comparaison de périodes
                    </CardTitle>
                    <CardDescription>
                      Comparez votre activité musicale sur différentes périodes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('week')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Semaine
                    </Button>
                    <Button
                      variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('month')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Mois
                    </Button>
                    <Button
                      variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('year')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Année
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analyse comparative pour la période : {selectedPeriod}</p>
                  <p className="text-sm mt-2">Fonctionnalité en développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Insights personnalisés par IA
                </CardTitle>
                <CardDescription>
                  Découvertes basées sur votre historique d'écoute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights ? (
                  <div className="space-y-4">
                    {/* Genres suggérés */}
                    {insights.suggestedGenres && insights.suggestedGenres.length > 0 && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">Nouveaux genres à découvrir</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Basé sur votre historique, ces genres pourraient vous plaire
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {insights.suggestedGenres.map((genre, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Changement de goût détecté */}
                    {insights.tasteChangeDetected && (
                      <Card className="bg-amber-500/10 border-amber-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">Évolution de vos goûts détectée</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Vos préférences musicales ont évolué. Voulez-vous ajuster automatiquement ?
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleApplyAdjustments}
                                  disabled={isApplying}
                                >
                                  {isApplying ? 'Application...' : 'Ajuster mes préférences'}
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  Confiance: {Math.round(insights.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Ajustements tempo et énergie */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Music className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">Préférences détectées</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>
                                <strong>Tempo préféré:</strong> {insights.tempoShift.min} - {insights.tempoShift.max} BPM
                              </p>
                              <p>
                                <strong>Niveau d'énergie:</strong> {insights.energyLevelAdjustment}%
                              </p>
                              {insights.adjustedMoods && insights.adjustedMoods.length > 0 && (
                                <div>
                                  <strong>Moods populaires:</strong>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {insights.adjustedMoods.map((mood, i) => (
                                      <span
                                        key={i}
                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                                      >
                                        {mood}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun insight disponible pour le moment</p>
                    <p className="text-sm mt-2">
                      Écoutez plus de musique pour obtenir des recommandations personnalisées
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleRunLearning}
                      disabled={isAnalyzing}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Lancer l'analyse
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicAnalyticsPage;
