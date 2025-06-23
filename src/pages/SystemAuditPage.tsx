
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SystemAudit from '@/components/audit/SystemAudit';
import PageAuditTool from '@/components/audit/PageAuditTool';
import { useOptimization } from '@/contexts/OptimizationContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Shield, Zap, Database } from 'lucide-react';

const SystemAuditPage: React.FC = () => {
  const { performanceScore, cacheStats, webVitals, clearCache } = useOptimization();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Système</h1>
          <p className="text-muted-foreground">
            Surveillance complète des performances et de la qualité
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-3 w-3 mr-1" />
            Score: {performanceScore.toFixed(0)}/100
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="routes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">
            <Shield className="h-4 w-4 mr-2" />
            Routes
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="cache">
            <Database className="h-4 w-4 mr-2" />
            Cache
          </TabsTrigger>
          <TabsTrigger value="pages">
            <Activity className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
          <SystemAudit />
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Web Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{webVitals.fcp?.toFixed(0) || '-'}ms</div>
                    <div className="text-sm text-muted-foreground">First Contentful Paint</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{webVitals.lcp?.toFixed(0) || '-'}ms</div>
                    <div className="text-sm text-muted-foreground">Largest Contentful Paint</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{webVitals.cls?.toFixed(3) || '-'}</div>
                    <div className="text-sm text-muted-foreground">Cumulative Layout Shift</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{webVitals.fid?.toFixed(0) || '-'}ms</div>
                    <div className="text-sm text-muted-foreground">First Input Delay</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Statistiques du Cache</CardTitle>
                <Button onClick={clearCache} variant="outline" size="sm">
                  Vider le cache
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(cacheStats).map(([type, stats]: [string, any]) => (
                  <div key={type} className="p-4 border rounded-lg">
                    <div className="font-medium capitalize mb-2">{type}</div>
                    <div className="space-y-1 text-sm">
                      <div>Taille: {stats?.size || 0}/{stats?.maxSize || 0}</div>
                      <div>Hit Rate: {stats?.hitRate || 0}</div>
                      <div>Age moyen: {((stats?.averageAge || 0) / 1000).toFixed(1)}s</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <PageAuditTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemAuditPage;
