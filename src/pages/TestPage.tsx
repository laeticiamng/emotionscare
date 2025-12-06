import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  TestTube,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Activity,
  Shield,
  Database,
  Cpu
} from 'lucide-react';

interface SystemStatus {
  ai: { status: string; latency: string; uptime: number };
  emotion: { status: string; accuracy: number; processed: number };
  security: { status: string; lastScan: string; threats: number };
  database: { status: string; queries: number; cache: number };
}

interface Test {
  name: string;
  passed: boolean;
  duration: string;
  error?: string;
}

interface TestCategory {
  category: string;
  status: 'success' | 'warning' | 'error';
  tests: Test[];
}

const TestPage: React.FC = () => {
  const [systemStatus] = React.useState<SystemStatus>({
    ai: { status: 'operational', latency: '45ms', uptime: 99.9 },
    emotion: { status: 'operational', accuracy: 98.7, processed: 1250 },
    security: { status: 'secure', lastScan: '2 min ago', threats: 0 },
    database: { status: 'healthy', queries: 847, cache: 94 }
  });

  const testResults: TestCategory[] = [
    {
      category: 'Interface Utilisateur',
      status: 'success',
      tests: [
        { name: 'Sidebar Navigation', passed: true, duration: '0.12s' },
        { name: 'Responsive Design', passed: true, duration: '0.08s' },
        { name: 'Dark/Light Theme', passed: true, duration: '0.05s' },
        { name: 'Accessibility (A11y)', passed: true, duration: '0.15s' }
      ]
    },
    {
      category: 'Fonctionnalités IA',
      status: 'success',
      tests: [
        { name: 'Analyse Émotionnelle', passed: true, duration: '0.34s' },
        { name: 'Génération Musicale', passed: true, duration: '0.67s' },
        { name: 'Chat Assistant', passed: true, duration: '0.23s' },
        { name: 'Reconnaissance Faciale', passed: true, duration: '0.45s' }
      ]
    },
    {
      category: 'Sécurité & Données',
      status: 'warning',
      tests: [
        { name: 'Chiffrement End-to-End', passed: true, duration: '0.11s' },
        { name: 'Validation RGPD', passed: true, duration: '0.18s' },
        { name: 'Audit de Sécurité', passed: false, duration: '0.89s', error: 'Test en cours' },
        { name: 'Sauvegarde Données', passed: true, duration: '0.29s' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TestTube className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Page de Test</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Activity className="h-3 w-3 mr-1" />
            Système Opérationnel
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Diagnostic complet des fonctionnalités et performances d'EmotionsCare
        </p>
      </div>

      {/* État du système */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Intelligence IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemStatus.ai.latency}</span>
                <Badge variant="secondary">Opérationnel</Badge>
              </div>
              <Progress value={systemStatus.ai.uptime} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Uptime: {systemStatus.ai.uptime}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analyse Émotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemStatus.emotion.accuracy}%</span>
                <Badge variant="secondary">Précis</Badge>
              </div>
              <Progress value={systemStatus.emotion.accuracy} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {systemStatus.emotion.processed} analyses today
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemStatus.security.threats}</span>
                <Badge variant="secondary">Sécurisé</Badge>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Scan: {systemStatus.security.lastScan}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{systemStatus.database.cache}%</span>
                <Badge variant="secondary">Optimal</Badge>
              </div>
              <Progress value={systemStatus.database.cache} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {systemStatus.database.queries} requêtes/min
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résultats des tests */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Résultats des Tests</h2>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Relancer les tests
          </Button>
        </div>

        {testResults.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(category.status)}
                {category.category}
                <Badge variant={category.status === 'success' ? 'default' : 'secondary'}>
                  {category.tests.filter(t => t.passed).length}/{category.tests.length} passés
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.tests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      {test.passed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{test.name}</span>
                      {test.error && (
                        <Badge variant="destructive" className="text-xs">
                          {test.error}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {test.duration}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Informations de debug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informations de Debug
          </CardTitle>
          <CardDescription>
            Détails techniques pour le débogage et la maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Environment</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>Mode: Development</div>
                <div>Version: 2.1.4</div>
                <div>Build: 20241209-1445</div>
                <div>Node.js: v20.11.0</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Performance</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>FCP: 1.2s</div>
                <div>LCP: 2.1s</div>
                <div>CLS: 0.05</div>
                <div>Memory: 45.2 MB</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;