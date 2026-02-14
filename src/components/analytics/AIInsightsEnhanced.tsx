// @ts-nocheck
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Target, Sparkles, Calendar, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export default function AIInsightsEnhanced() {
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [reportHistory, setReportHistory] = useState<any[]>([]);
  const [period, setPeriod] = useState('30');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [stats, setStats] = useState({
    totalReports: 0,
    totalDataPoints: 0,
    lastAnalysis: null
  });

  useEffect(() => {
    loadReportHistory();
    loadStats();
  }, []);

  const loadReportHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analytics_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReportHistory(data || []);
    } catch (error) {
      logger.error('Erreur chargement historique', error as Error, 'UI');
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analytics_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStats({
        totalReports: data?.length || 0,
        totalDataPoints: data?.reduce((sum, r) => sum + (r.data_points || 0), 0) || 0,
        lastAnalysis: data?.[0]?.created_at || null
      });
    } catch (error) {
      logger.error('Erreur chargement stats', error as Error, 'UI');
    }
  };

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-analytics-insights', {
        body: {
          action: 'generate',
          period,
          analysisType
        }
      });

      if (error) throw error;

      if (data.success) {
        setCurrentAnalysis(data.analysis);
        toast.success('Analyse générée avec succès');
        loadReportHistory();
        loadStats();
      } else {
        throw new Error(data.error || 'Erreur génération');
      }
    } catch (error) {
      logger.error('Erreur génération analyse', error as Error, 'UI');
      toast.error('Erreur lors de la génération de l\'analyse');
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (text: string) => {
    // Formater le texte markdown basique
    const sections = text.split(/\n(?=\d+\.|#+|\*\*)/g);
    return sections.map((section, idx) => {
      if (section.startsWith('#')) {
        const level = section.match(/^#+/)?.[0].length || 1;
        const content = section.replace(/^#+\s*/, '');
        return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{content}</h3>;
      }
      if (section.match(/^\d+\./)) {
        return <p key={idx} className="mb-3 pl-4">{section}</p>;
      }
      if (section.includes('**')) {
        const formatted = section.replace(/\*\*(.*?)\*\*/g, (_, text) => {
          return `<strong>${text}</strong>`;
        });
        const sanitized = DOMPurify.sanitize(formatted, {
          ALLOWED_TAGS: ['strong'],
          ALLOWED_ATTR: [],
        });
        return <p key={idx} className="mb-3" dangerouslySetInnerHTML={{ __html: sanitized }} />;
      }
      return <p key={idx} className="mb-3">{section}</p>;
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Insights IA Personnalisés
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyses prédictives et recommandations basées sur vos données émotionnelles
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Rapports générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Total d'analyses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Points de données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDataPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Données analysées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dernière analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastAnalysis 
                ? new Date(stats.lastAnalysis).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : 'Aucune'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Date du dernier rapport</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new">Nouvelle analyse</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Générer une analyse IA
              </CardTitle>
              <CardDescription>
                Sélectionnez les paramètres de votre analyse personnalisée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Période d'analyse</label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 derniers jours</SelectItem>
                      <SelectItem value="14">14 derniers jours</SelectItem>
                      <SelectItem value="30">30 derniers jours</SelectItem>
                      <SelectItem value="60">60 derniers jours</SelectItem>
                      <SelectItem value="90">90 derniers jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type d'analyse</label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Complète</SelectItem>
                      <SelectItem value="emotional">Émotionnelle</SelectItem>
                      <SelectItem value="behavioral">Comportementale</SelectItem>
                      <SelectItem value="predictive">Prédictive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateAnalysis}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Générer l'analyse IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {currentAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Résultats de l'analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {formatAnalysis(currentAnalysis)}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {reportHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune analyse générée pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créez votre première analyse pour commencer
                </p>
              </CardContent>
            </Card>
          ) : (
            reportHistory.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Analyse {report.analysis_type}
                      </CardTitle>
                      <CardDescription>
                        {new Date(report.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {report.period_days} jours
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {report.data_points} points de données
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {formatAnalysis(report.report_content)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
