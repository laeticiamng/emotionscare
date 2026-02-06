// @ts-nocheck
/**
 * Page de rapports B2B - Affiche les rapports mensuels générés
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Shield,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Report {
  id: string;
  period: string;
  title: string;
  narrative: string;
  metrics: {
    total_sessions: number;
    avg_weekly_users: number;
    avg_session_duration: number;
    adoption_rate: number;
  };
  content: {
    key_insights: string[];
    recommendations: string[];
  };
  generated_at: string;
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const orgId = (user?.user_metadata?.org_id as string) || '';
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReports() {
      if (!orgId) return;
      
      try {
        const { data, error } = await supabase
          .from('b2b_reports')
          .select('*')
          .eq('org_id', orgId)
          .eq('report_type', 'monthly')
          .order('period', { ascending: false });

        if (error) throw error;
        setReports(data || []);
        if (data && data.length > 0) {
          setSelectedReport(data[0]);
        }
      } catch (err) {
        logger.error('Error fetching reports:', err, 'SYSTEM');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [orgId]);

  const handleGenerateReport = async () => {
    try {
      const response = await supabase.functions.invoke('b2b-monthly-report', {
        body: { org_id: orgId },
      });
      
      if (response.data?.report) {
        setReports(prev => [response.data.report, ...prev]);
        setSelectedReport(response.data.report);
      }
    } catch (err) {
      logger.error('Error generating report:', err, 'SYSTEM');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/b2b/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <h1 className="font-semibold">Rapports mensuels</h1>
              </div>
            </div>
            <Button onClick={handleGenerateReport}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Générer un rapport
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des rapports */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Historique</h2>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucun rapport disponible</p>
                  <Button className="mt-4" onClick={handleGenerateReport}>
                    Générer le premier rapport
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedReport?.id === report.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(report.generated_at), 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {report.metrics?.adoption_rate || 0}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Détail du rapport */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedReport.title}</CardTitle>
                        <CardDescription>
                          Généré le {format(new Date(selectedReport.generated_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Métriques clés */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{selectedReport.metrics?.adoption_rate || 0}%</div>
                        <div className="text-xs text-muted-foreground">Adoption</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{selectedReport.metrics?.avg_weekly_users || 0}</div>
                        <div className="text-xs text-muted-foreground">Utilisateurs/sem</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <FileText className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{selectedReport.metrics?.total_sessions || 0}</div>
                        <div className="text-xs text-muted-foreground">Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{selectedReport.metrics?.avg_session_duration || 0}m</div>
                        <div className="text-xs text-muted-foreground">Durée moy.</div>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div className="prose prose-sm max-w-none mb-6">
                      <h3 className="text-lg font-semibold mb-3">Synthèse</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedReport.narrative}
                      </p>
                    </div>

                    {/* Insights */}
                    {selectedReport.content?.key_insights?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Points clés</h3>
                        <ul className="space-y-2">
                          {selectedReport.content.key_insights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-success">✓</span>
                              <span className="text-muted-foreground">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {selectedReport.content?.recommendations?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Recommandations</h3>
                        <ul className="space-y-2">
                          {selectedReport.content.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">→</span>
                              <span className="text-muted-foreground">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Footer éthique */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Données anonymisées • Aucune information individuelle</span>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Sélectionnez un rapport pour voir les détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
