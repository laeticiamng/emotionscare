import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ExecutiveKPI {
  id: string;
  current_score: number;
  risk_prediction: 'faible' | 'moyen' | 'élevé';
  recommendations: string[];
  critical_kpis: string[];
  trend: 'improving' | 'stable' | 'degrading';
  created_at: string;
}

export const ExecutiveDashboard = () => {
  const [kpi, setKpi] = useState<ExecutiveKPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLatestKPI();
  }, []);

  const loadLatestKPI = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('executive_kpis')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading KPI:', error);
      return;
    }

    setKpi(data);
  };

  const generateNewInsights = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const response = await supabase.functions.invoke('executive-dashboard-ai', {
        body: { userId: user.id }
      });

      if (response.error) throw response.error;

      toast({ title: 'Insights générés', description: 'Nouvelles prédictions IA disponibles' });
      loadLatestKPI();
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'faible': return 'hsl(var(--primary))';
      case 'moyen': return 'hsl(45, 100%, 51%)';
      case 'élevé': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-primary" />;
      case 'degrading': return <TrendingDown className="w-5 h-5 text-destructive" />;
      default: return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord exécutif RGPD</h2>
        <Button onClick={generateNewInsights} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Génération...' : 'Générer insights IA'}
        </Button>
      </div>

      {!kpi ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Aucun insight disponible</p>
          <Button onClick={generateNewInsights} disabled={isLoading}>
            Générer le premier rapport
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score global */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Score de conformité</h3>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-primary">{kpi.current_score}/100</div>
              <Progress value={kpi.current_score} className="h-3" />
              <div className="text-sm text-muted-foreground">
                Tendance: <span className="font-semibold capitalize">{kpi.trend === 'improving' ? 'En amélioration' : kpi.trend === 'degrading' ? 'En dégradation' : 'Stable'}</span>
              </div>
            </div>
          </Card>

          {/* Prédiction des risques */}
          <Card className="p-6" style={{ borderLeft: `4px solid ${getRiskColor(kpi.risk_prediction)}` }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6" style={{ color: getRiskColor(kpi.risk_prediction) }} />
              <h3 className="text-lg font-semibold text-foreground">Prédiction risques (30j)</h3>
            </div>
            <div className="text-2xl font-bold capitalize" style={{ color: getRiskColor(kpi.risk_prediction) }}>
              Risque {kpi.risk_prediction}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Basé sur l'analyse IA des tendances récentes
            </p>
          </Card>

          {/* Recommandations stratégiques */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recommandations stratégiques</h3>
            <div className="space-y-3">
              {kpi.recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-accent/5 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* KPIs critiques */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">KPIs critiques à surveiller</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpi.critical_kpis.map((kpiItem, idx) => (
                <div key={idx} className="p-4 bg-muted/50 rounded-lg text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">{kpiItem}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Métadonnées */}
          <Card className="p-4 md:col-span-2 bg-muted/30">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold">Dernière mise à jour:</span> {new Date(kpi.created_at).toLocaleString('fr-FR')}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
