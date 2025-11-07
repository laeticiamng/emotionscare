import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Download, Trash2, Bell } from 'lucide-react';
import ConsentStatsCard from '@/components/gdpr/ConsentStatsCard';
import AuditLogsTable from '@/components/gdpr/AuditLogsTable';
import ExportRequestsTable from '@/components/gdpr/ExportRequestsTable';
import DataExportStatsChart from '@/components/gdpr/DataExportStatsChart';
import DataDeletionStatsChart from '@/components/gdpr/DataDeletionStatsChart';
import GDPRAlerts from '@/components/gdpr/GDPRAlerts';
import GDPRComplianceGauge from '@/components/gdpr/GDPRComplianceGauge';
import GDPRRecommendations from '@/components/gdpr/GDPRRecommendations';
import ExportReportButton from '@/components/gdpr/ExportReportButton';
import { ScheduledExportsManager } from '@/components/gdpr/ScheduledExportsManager';
import CriticalAlertsNotification from '@/components/gdpr/CriticalAlertsNotification';
import GDPRRealtimeDashboard from '@/components/gdpr/GDPRRealtimeDashboard';
import GDPRAlertHistory from '@/components/gdpr/GDPRAlertHistory';
import GDPRAuditTrail from '@/components/gdpr/GDPRAuditTrail';
import GDPRExecutiveDashboard from '@/components/gdpr/GDPRExecutiveDashboard';
import { DataRetentionConfig } from '@/components/gdpr/DataRetentionConfig';
import { AnomalyDetectionDashboard } from '@/components/gdpr/AnomalyDetectionDashboard';
import { PrivacyPolicyManager } from '@/components/gdpr/PrivacyPolicyManager';
import { PseudonymizationManager } from '@/components/gdpr/PseudonymizationManager';
import { ConsentManagementPanel } from '@/components/gdpr/ConsentManagementPanel';
import { ConsentAnalyticsDashboard } from '@/components/gdpr/ConsentAnalyticsDashboard';
import { WebhookManager } from '@/components/gdpr/WebhookManager';
import { ComplianceAuditDashboard } from '@/components/gdpr/ComplianceAuditDashboard';
import { ScheduledAuditsManager } from '@/components/gdpr/ScheduledAuditsManager';
import { useGDPRMonitoring } from '@/hooks/useGDPRMonitoring';
import { useGDPRComplianceScore } from '@/hooks/useGDPRComplianceScore';
import { useGDPRRealtimeAlerts } from '@/hooks/useGDPRRealtimeAlerts';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const GDPRMonitoringPage: React.FC = () => {
  const { consentStats, auditLogs, exportStats, deletionStats, isLoading } = useGDPRMonitoring();
  const { data: complianceData, isLoading: isLoadingCompliance } = useGDPRComplianceScore();
  const { criticalAlerts, isConnected, resolveCriticalAlert } = useGDPRRealtimeAlerts({
    enableSound: true,
    enableBrowserNotifications: true,
  });
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      {/* Bannière de notifications critiques en temps réel */}
      <CriticalAlertsNotification
        alerts={criticalAlerts}
        onResolve={resolveCriticalAlert}
        onViewAll={() => setActiveTab('alerts')}
      />

      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Monitoring RGPD</h1>
                {isConnected && (
                  <Badge variant="outline" className="text-xs">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    Temps réel actif
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Tableau de bord de conformité et audit des données personnelles
              </p>
            </div>
          </div>
          <ExportReportButton />
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 lg:grid-cols-19">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="executive">Exécutif</TabsTrigger>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Conformité
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alertes
          </TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="retention">Rétention</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies ML</TabsTrigger>
          <TabsTrigger value="policies">
            <FileText className="h-4 w-4 mr-2" />
            Politiques
          </TabsTrigger>
          <TabsTrigger value="pseudonymization">Pseudonymisation</TabsTrigger>
          <TabsTrigger value="consent-management">Gestion Consentements</TabsTrigger>
          <TabsTrigger value="consent-analytics">Analytics Consentements</TabsTrigger>
          <TabsTrigger value="consents">Stats Consentements</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="audit">Audit Conformité</TabsTrigger>
          <TabsTrigger value="scheduled">Planifications</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="scheduled-exports">Exports planifiés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Compliance Score Preview */}
          {complianceData && !isLoadingCompliance && (
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Score de conformité RGPD</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold text-foreground">
                          {complianceData.score}
                        </span>
                        <span className="text-lg text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('compliance')}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Voir les détails →
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          <GDPRAlerts />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consentements Actifs</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{consentStats?.totalConsents || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {consentStats?.analyticsConsents || 0} analytics acceptés
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Exports de données</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{exportStats?.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {exportStats?.pending || 0} en attente
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Suppressions</CardTitle>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{deletionStats?.total || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {deletionStats?.completed || 0} complétées
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Événements Audit</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditLogs?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Dernières 24h</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataExportStatsChart data={exportStats?.timeline || []} isLoading={isLoading} />
            <DataDeletionStatsChart data={deletionStats?.timeline || []} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="executive" className="space-y-6 mt-6">
          <GDPRExecutiveDashboard />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6 mt-6">
          <GDPRRealtimeDashboard />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GDPRComplianceGauge
              score={complianceData?.score || 0}
              breakdown={complianceData?.breakdown || {
                consentRate: 0,
                exportSpeed: 0,
                deletionSpeed: 0,
                alerts: 0,
                overdueCompliance: 0,
              }}
              isLoading={isLoadingCompliance}
            />
            <GDPRRecommendations
              recommendations={complianceData?.recommendations || []}
              isLoading={isLoadingCompliance}
            />
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6 mt-6">
          <GDPRAlerts />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-6">
          <GDPRAlertHistory />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <GDPRAuditTrail />
        </TabsContent>

        <TabsContent value="retention" className="space-y-6 mt-6">
          <DataRetentionConfig />
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6 mt-6">
          <AnomalyDetectionDashboard />
        </TabsContent>

        <TabsContent value="policies" className="space-y-6 mt-6">
          <PrivacyPolicyManager />
        </TabsContent>

        <TabsContent value="pseudonymization" className="space-y-6 mt-6">
          <PseudonymizationManager />
        </TabsContent>

        <TabsContent value="consent-management" className="space-y-6 mt-6">
          <ConsentManagementPanel />
        </TabsContent>

        <TabsContent value="consent-analytics" className="space-y-6 mt-6">
          <ConsentAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="consents" className="space-y-6 mt-6">
          <ConsentStatsCard stats={consentStats} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6 mt-6">
          <WebhookManager />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <ComplianceAuditDashboard />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6 mt-6">
          <ScheduledAuditsManager />
        </TabsContent>

        <TabsContent value="exports" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6">
            <DataExportStatsChart data={exportStats?.timeline || []} isLoading={isLoading} />
            <ExportRequestsTable 
              requests={exportStats?.recentRequests || []} 
              isLoading={isLoading} 
            />
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-6">
          <AuditLogsTable logs={auditLogs || []} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="scheduled-exports" className="space-y-6 mt-6">
          <ScheduledExportsManager />
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
};

export default GDPRMonitoringPage;
