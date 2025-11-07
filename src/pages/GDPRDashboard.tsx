import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBlockchainBackups } from '@/hooks/useBlockchainBackups';
import { useEdgeFunctionLogs } from '@/hooks/useCronJobs';
import { 
  Shield, 
  Database, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Bell,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';

/**
 * Dashboard RGPD centralisé - Vue d'ensemble complète
 * Regroupe monitoring cron, backups blockchain, et conformité globale
 */
export const GDPRDashboard = () => {
  const { integrityStats, backups, isLoading: loadingBackups } = useBlockchainBackups();
  const { data: pdfReportsLogs, isLoading: loadingPdfReports } = useEdgeFunctionLogs('scheduled-pdf-reports');
  const { data: notificationsLogs, isLoading: loadingNotifications } = useEdgeFunctionLogs('pdf-notifications');

  const getIntegrityColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIntegrityBadge = (score: number) => {
    if (score >= 95) {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Excellent</Badge>;
    }
    if (score >= 80) {
      return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Bon</Badge>;
    }
    return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Compromis</Badge>;
  };

  // Statistiques des jobs cron
  const pdfReportsSuccess = pdfReportsLogs?.filter(log => log.status === 'completed').length || 0;
  const pdfReportsTotal = pdfReportsLogs?.length || 0;
  const pdfReportsSuccessRate = pdfReportsTotal > 0 ? Math.round((pdfReportsSuccess / pdfReportsTotal) * 100) : 0;

  const notificationsSuccess = notificationsLogs?.filter(log => log.severity !== 'critical').length || 0;
  const notificationsTotal = notificationsLogs?.length || 0;
  const notificationsSuccessRate = notificationsTotal > 0 ? Math.round((notificationsSuccess / notificationsTotal) * 100) : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Tableau de Bord RGPD
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble complète de la conformité, des backups blockchain et du monitoring système
        </p>
      </div>

      {/* KPI Cards - Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Score d'Intégrité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getIntegrityColor(integrityStats?.integrityScore || 0)}`}>
              {integrityStats?.integrityScore || 0}%
            </div>
            <Progress value={integrityStats?.integrityScore || 0} className="mt-2" />
            <div className="mt-2">{getIntegrityBadge(integrityStats?.integrityScore || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Blocs Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{integrityStats?.totalBlocks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {integrityStats?.validBlocks || 0} valides
            </p>
            <Badge variant="outline" className="mt-2">
              {backups?.length || 0} backup(s)
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Rapports PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{pdfReportsSuccess}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pdfReportsSuccessRate}% de succès
            </p>
            <Progress value={pdfReportsSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">{notificationsSuccess}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {notificationsSuccessRate}% envoyées
            </p>
            <Progress value={notificationsSuccessRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="cron">Jobs Cron</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* État de la Blockchain */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  État de la Blockchain
                </CardTitle>
                <CardDescription>Intégrité et santé de la chaîne d'audit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Score d'intégrité</span>
                  <span className={`text-2xl font-bold ${getIntegrityColor(integrityStats?.integrityScore || 0)}`}>
                    {integrityStats?.integrityScore || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total blocs</span>
                  <span className="font-semibold">{integrityStats?.totalBlocks || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chaînes brisées</span>
                  <span className={`font-semibold ${integrityStats?.brokenChainCount ? 'text-red-500' : 'text-green-500'}`}>
                    {integrityStats?.brokenChainCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Backups disponibles</span>
                  <span className="font-semibold">{backups?.length || 0}</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link to="/gdpr/blockchain-backups">
                    Gérer les Backups Blockchain
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* État des Jobs Cron */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Jobs Cron Automatisés
                </CardTitle>
                <CardDescription>Surveillance des tâches planifiées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Rapports PDF</span>
                    <Badge variant="outline">Toutes les heures</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={pdfReportsSuccessRate} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{pdfReportsSuccessRate}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {pdfReportsSuccess}/{pdfReportsTotal} succès récents
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Notifications</span>
                    <Badge variant="outline">2x/jour</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={notificationsSuccessRate} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{notificationsSuccessRate}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {notificationsSuccess}/{notificationsTotal} envoyées
                  </div>
                </div>

                <Button className="w-full mt-4" asChild>
                  <Link to="/gdpr/cron-monitoring">
                    Voir le Monitoring Complet
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alertes et Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Alertes et Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrityStats?.brokenChainCount && integrityStats.brokenChainCount > 0 ? (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">
                      ⚠️ Incohérences détectées dans la blockchain
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      {integrityStats.brokenChainCount} chaîne(s) brisée(s) détectée(s). 
                      Recommandation : Restaurer depuis le dernier backup valide.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">
                      ✅ Blockchain intègre
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Aucune incohérence détectée. La chaîne d'audit est saine.
                    </p>
                  </div>
                </div>
              )}

              {pdfReportsSuccessRate < 80 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-900">
                      ⚠️ Taux de succès des rapports PDF bas
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Seulement {pdfReportsSuccessRate}% de succès. Vérifiez les logs pour identifier les problèmes.
                    </p>
                  </div>
                </div>
              )}

              {(!backups || backups.length === 0) && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-900">
                      ⚠️ Aucun backup blockchain disponible
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Créez un backup pour sécuriser votre chaîne d'audit.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Backups Blockchain</CardTitle>
              <CardDescription>
                Pour une gestion complète, accédez à la page dédiée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link to="/gdpr/blockchain-backups">
                  <Database className="h-4 w-4 mr-2" />
                  Ouvrir la Gestion Blockchain Complète
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cron Jobs Tab */}
        <TabsContent value="cron">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring des Jobs Cron</CardTitle>
              <CardDescription>
                Pour le monitoring en temps réel, accédez à la page dédiée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link to="/gdpr/cron-monitoring">
                  <Clock className="h-4 w-4 mr-2" />
                  Ouvrir le Monitoring Complet
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de Conformité</CardTitle>
              <CardDescription>Vue d'ensemble de la conformité RGPD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{integrityStats?.integrityScore || 0}%</div>
                  <div className="text-sm text-muted-foreground">Score Global</div>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{integrityStats?.validBlocks || 0}</div>
                  <div className="text-sm text-muted-foreground">Blocs Valides</div>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{pdfReportsTotal}</div>
                  <div className="text-sm text-muted-foreground">Rapports Générés</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GDPRDashboard;
