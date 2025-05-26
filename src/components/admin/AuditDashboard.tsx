
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { runEmotionsCareAudit, AuditResult } from '@/utils/auditSystem';
import { AlertTriangle, CheckCircle, XCircle, Play, RefreshCw } from 'lucide-react';

const AuditDashboard: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const { results } = await runEmotionsCareAudit();
      setAuditResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Erreur audit:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedResults = auditResults.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, AuditResult[]>);

  const successCount = auditResults.filter(r => r.status === 'success').length;
  const warningCount = auditResults.filter(r => r.status === 'warning').length;
  const errorCount = auditResults.filter(r => r.status === 'error').length;
  const totalCount = auditResults.length;
  const score = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit EmotionsCare</h1>
          <p className="text-muted-foreground">
            Vérification complète de l'intégration et de la qualité
          </p>
        </div>
        
        <Button onClick={runAudit} disabled={isRunning} className="flex items-center gap-2">
          {isRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Audit en cours...' : 'Lancer l\'audit'}
        </Button>
      </div>

      {lastRun && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Score Global
              <Badge variant={score >= 90 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}>
                {score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={score} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-muted-foreground">Succès</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                  <div className="text-sm text-muted-foreground">Avertissements</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-muted-foreground">Erreurs</div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                Dernière vérification: {lastRun.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(groupedResults).length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="Backend">Backend</TabsTrigger>
            <TabsTrigger value="Navigation">Navigation</TabsTrigger>
            <TabsTrigger value="Performance">Performance</TabsTrigger>
            <TabsTrigger value="Accessibility">Accessibilité</TabsTrigger>
            <TabsTrigger value="Security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(groupedResults).map(([category, results]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category}
                      <Badge variant="outline">
                        {results.filter(r => r.status === 'success').length}/{results.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.slice(0, 3).map((result, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="text-sm">{result.message}</span>
                        </div>
                      ))}
                      {results.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{results.length - 3} autres résultats...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {Object.entries(groupedResults).map(([category, results]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.message}</span>
                        </div>
                        {result.details && (
                          <pre className="mt-2 text-xs bg-white/50 p-2 rounded">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {auditResults.length === 0 && !isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              Aucun audit exécuté. Cliquez sur "Lancer l'audit" pour commencer.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditDashboard;
