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
import ExportReportButton from '@/components/gdpr/ExportReportButton';
import { useGDPRMonitoring } from '@/hooks/useGDPRMonitoring';
import { Skeleton } from '@/components/ui/skeleton';

const GDPRMonitoringPage: React.FC = () => {
  const { consentStats, auditLogs, exportStats, deletionStats, isLoading } = useGDPRMonitoring();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Monitoring RGPD</h1>
            <p className="text-muted-foreground">
              Tableau de bord de conformité et audit des données personnelles
            </p>
          </div>
        </div>
        <ExportReportButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alertes
          </TabsTrigger>
          <TabsTrigger value="consents">Consentements</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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

        <TabsContent value="alerts" className="space-y-6 mt-6">
          <GDPRAlerts />
        </TabsContent>

        <TabsContent value="consents" className="space-y-6 mt-6">
          <ConsentStatsCard stats={consentStats} isLoading={isLoading} />
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

        <TabsContent value="audit" className="space-y-6 mt-6">
          <AuditLogsTable logs={auditLogs || []} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GDPRMonitoringPage;
