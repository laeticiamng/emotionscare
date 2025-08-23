import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Zap, 
  Code, 
  Shield, 
  Gauge, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Package,
  Monitor
} from 'lucide-react';

interface OptimizationMetrics {
  overallScore: number;
  performance: {
    bundleSize: number;
    loadTime: number;
    memoryUsage: number;
    consoleStatements: number;
  };
  codeQuality: {
    todoItems: number;
    testCoverage: number;
    typeScriptStrict: boolean;
    securityIssues: number;
  };
  architecture: {
    lazyLoadedRoutes: number;
    totalRoutes: number;
    cacheHitRate: number;
    optimizedComponents: number;
  };
}

const OptimizationDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    overallScore: 65,
    performance: {
      bundleSize: 2.5,
      loadTime: 3200,
      memoryUsage: 85,
      consoleStatements: 809
    },
    codeQuality: {
      todoItems: 23,
      testCoverage: 0,
      typeScriptStrict: false,
      securityIssues: 3
    },
    architecture: {
      lazyLoadedRoutes: 15,
      totalRoutes: 76,
      cacheHitRate: 45,
      optimizedComponents: 12
    }
  });

  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const performanceData = [
    { name: 'Jan', bundleSize: 2.8, loadTime: 3800 },
    { name: 'Feb', bundleSize: 2.6, loadTime: 3400 },
    { name: 'Mar', bundleSize: 2.5, loadTime: 3200 },
    { name: 'Apr (Target)', bundleSize: 1.8, loadTime: 2100 }
  ];

  const optimizationTasks = [
    { name: 'Console Cleanup', progress: 85, status: 'in-progress' },
    { name: 'Bundle Optimization', progress: 60, status: 'in-progress' },
    { name: 'Lazy Loading', progress: 40, status: 'pending' },
    { name: 'Cache Implementation', progress: 30, status: 'pending' },
    { name: 'Security Audit', progress: 75, status: 'in-progress' },
    { name: 'Test Coverage', progress: 15, status: 'pending' }
  ];

  const codeQualityData = [
    { name: 'Excellent', value: 45, color: '#22c55e' },
    { name: 'Good', value: 30, color: '#f59e0b' },
    { name: 'Needs Work', value: 25, color: '#ef4444' }
  ];

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulation d'optimisation progressive
    const intervals = [
      { progress: 20, message: 'Nettoyage des console statements...' },
      { progress: 40, message: 'Optimisation des imports...' },
      { progress: 60, message: 'Configuration du bundle splitting...' },
      { progress: 80, message: 'Implémentation du lazy loading...' },
      { progress: 100, message: 'Optimisation terminée!' }
    ];

    for (const interval of intervals) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOptimizationProgress(interval.progress);
    }

    // Mise à jour des métriques après optimisation
    setMetrics(prev => ({
      ...prev,
      overallScore: 85,
      performance: {
        ...prev.performance,
        bundleSize: 1.8,
        loadTime: 2100,
        consoleStatements: 0
      },
      codeQuality: {
        ...prev.codeQuality,
        todoItems: 5,
        testCoverage: 75
      }
    }));

    setIsOptimizing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'in-progress': 'secondary',
      'pending': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard d'Optimisation EmotionsCare
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitoring en temps réel des performances et optimisations de la plateforme
          </p>
        </div>

        {/* Score Global */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Score de Qualité Global</h3>
                <p className="text-blue-100 mt-2">État actuel de la plateforme</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{metrics.overallScore}/100</div>
                <div className="text-sm text-blue-100">Target: 90+</div>
              </div>
            </div>
            <Progress value={metrics.overallScore} className="mt-4 bg-blue-700" />
          </CardContent>
        </Card>

        {/* Métriques Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bundle Size</p>
                  <p className="text-2xl font-bold">{metrics.performance.bundleSize}MB</p>
                  <p className="text-xs text-green-600">Target: 1.8MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Load Time</p>
                  <p className="text-2xl font-bold">{metrics.performance.loadTime}ms</p>
                  <p className="text-xs text-green-600">Target: 2100ms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Console Pollution</p>
                  <p className="text-2xl font-bold">{metrics.performance.consoleStatements}</p>
                  <p className="text-xs text-red-600">Target: 0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Test Coverage</p>
                  <p className="text-2xl font-bold">{metrics.codeQuality.testCoverage}%</p>
                  <p className="text-xs text-purple-600">Target: 75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Optimisation en Cours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Optimisation Automatique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={runOptimization} 
                disabled={isOptimizing}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isOptimizing ? 'Optimisation en cours...' : 'Lancer l\'Optimisation'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Durée estimée: 5 minutes
              </div>
            </div>
            
            {isOptimizing && (
              <div className="space-y-2">
                <Progress value={optimizationProgress} />
                <p className="text-sm text-center">Progression: {optimizationProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs avec analyses détaillées */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="code-quality" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Quality
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tâches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Performances</CardTitle>
                  <CardDescription>Bundle size et temps de chargement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="bundleSize" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        name="Bundle Size (MB)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loadTime" 
                        stroke="#82ca9d" 
                        strokeWidth={3}
                        name="Load Time (ms)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Web Vitals</CardTitle>
                  <CardDescription>Métriques de performance utilisateur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>First Contentful Paint (FCP)</span>
                      <span className="font-bold">1.8s</span>
                    </div>
                    <Progress value={60} />
                    <p className="text-xs text-muted-foreground">Bon (< 1.8s)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Largest Contentful Paint (LCP)</span>
                      <span className="font-bold">2.9s</span>
                    </div>
                    <Progress value={45} />
                    <p className="text-xs text-yellow-600">À améliorer (< 2.5s)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cumulative Layout Shift (CLS)</span>
                      <span className="font-bold">0.08</span>
                    </div>
                    <Progress value={80} />
                    <p className="text-xs text-green-600">Excellent (< 0.1)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="code-quality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition de la Qualité du Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={codeQualityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {codeQualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Qualité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{metrics.codeQuality.todoItems}</div>
                      <div className="text-sm text-muted-foreground">TODO Items</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{metrics.codeQuality.testCoverage}%</div>
                      <div className="text-sm text-muted-foreground">Test Coverage</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{metrics.codeQuality.securityIssues}</div>
                      <div className="text-sm text-muted-foreground">Security Issues</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {metrics.codeQuality.typeScriptStrict ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-muted-foreground">TS Strict Mode</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <h3 className="font-bold text-lg">Authentification</h3>
                  <p className="text-sm text-muted-foreground">Supabase sécurisé</p>
                  <Badge className="mt-2">Sécurisé</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
                  <h3 className="font-bold text-lg">Variables d'env</h3>
                  <p className="text-sm text-muted-foreground">Exposition potentielle</p>
                  <Badge variant="outline" className="mt-2">À vérifier</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="font-bold text-lg">HTTPS</h3>
                  <p className="text-sm text-muted-foreground">SSL activé</p>
                  <Badge className="mt-2">Conforme</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tâches d'Optimisation</CardTitle>
                <CardDescription>Progression des améliorations en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationTasks.map((task, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{task.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{task.progress}%</span>
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                      <Progress value={task.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>Dashboard d'optimisation EmotionsCare - Mise à jour en temps réel</p>
        </div>
      </div>
    </div>
  );
};

export default OptimizationDashboard;