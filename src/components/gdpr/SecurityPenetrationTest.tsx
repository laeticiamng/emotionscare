import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  affected_resources: string[];
  risk: string;
  recommendation: string;
  remediation: string;
}

interface TestReport {
  security_score: number;
  vulnerabilities: Vulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function SecurityPenetrationTest() {
  const [report, setReport] = useState<TestReport | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('security-penetration-test', {
        body: {},
      });

      if (error) throw error;

      setReport(data.report);
      toast.success('Tests de sécurité terminés');
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Tests de Pénétration Automatisés
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Détection automatique des vulnérabilités de sécurité
          </p>
        </CardHeader>
        <CardContent>
          {!report ? (
            <Button onClick={runTests} disabled={isTesting} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              {isTesting ? 'Tests en cours...' : 'Lancer les tests de sécurité'}
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Score de Sécurité</p>
                  <p className="text-4xl font-bold">{report.security_score}/100</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">{report.summary.critical}</p>
                    <p className="text-xs text-muted-foreground">Critique</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{report.summary.high}</p>
                    <p className="text-xs text-muted-foreground">Haute</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">{report.summary.medium}</p>
                    <p className="text-xs text-muted-foreground">Moyenne</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{report.summary.low}</p>
                    <p className="text-xs text-muted-foreground">Basse</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Vulnérabilités Détectées</h3>
                <div className="space-y-3">
                  {report.vulnerabilities.map((vuln, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {getSeverityIcon(vuln.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{vuln.title}</span>
                            <Badge variant={getSeverityColor(vuln.severity) as any}>
                              {vuln.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                          <div className="text-xs space-y-1">
                            <p><strong>Catégorie:</strong> {vuln.category}</p>
                            <p><strong>Risque:</strong> {vuln.risk}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-blue-50 rounded">
                          <p className="font-medium text-blue-900 mb-1">💡 Recommandation</p>
                          <p className="text-blue-800">{vuln.recommendation}</p>
                        </div>

                        <div className="p-3 bg-muted rounded font-mono text-xs">
                          <p className="font-medium mb-1">Remédiation:</p>
                          <code>{vuln.remediation}</code>
                        </div>

                        {vuln.affected_resources.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {vuln.affected_resources.map((res, j) => (
                              <Badge key={j} variant="outline" className="text-xs">
                                {res}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={runTests} variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Relancer les tests
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
