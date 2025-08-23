import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Volume2, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Settings,
  Download,
  Play,
  Pause,
  BarChart3,
  Users,
  Accessibility,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useAccessibilityChecker } from '@/hooks/useAccessibilityChecker';

const AccessibilityDashboard: React.FC = () => {
  const { 
    report, 
    isChecking, 
    preferences, 
    checkAccessibility, 
    autoFix,
    getScoreColor,
    getImpactColor 
  } = useAccessibilityChecker();

  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Simulation de données historiques
  const [historicalData] = useState([
    { date: '2024-01-01', score: 65 },
    { date: '2024-01-15', score: 72 },
    { date: '2024-02-01', score: 78 },
    { date: '2024-02-15', score: 85 },
    { date: '2024-03-01', score: report?.score || 88 },
  ]);

  const handleAutoFix = async (issueId: string) => {
    if (!autoFixEnabled) return;
    
    const success = autoFix(issueId);
    if (success) {
      // Relancer la vérification après correction
      setTimeout(() => {
        checkAccessibility();
      }, 1000);
    }
  };

  const exportReport = () => {
    if (!report) return;
    
    const exportData = {
      timestamp: report.timestamp,
      score: report.score,
      wcagLevel: report.wcagLevel,
      issues: report.issues,
      preferences,
      url: window.location.href
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'serious':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'moderate':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'minor':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const criticalIssues = report?.issues.filter(i => i.impact === 'critical') || [];
  const seriousIssues = report?.issues.filter(i => i.impact === 'serious') || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Accessibility className="h-8 w-8 text-primary" />
            Audit d'Accessibilité
          </h1>
          <p className="text-muted-foreground mt-2">
            Surveillance et amélioration de l'accessibilité WCAG 2.1 niveau AA
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={exportReport}
            disabled={!report}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          
          <Button
            onClick={checkAccessibility}
            disabled={isChecking}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Vérification...' : 'Vérifier'}
          </Button>
        </div>
      </div>

      {/* Score principal */}
      {report && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Score d'Accessibilité</CardTitle>
                <CardDescription>
                  Dernière vérification: {report.timestamp.toLocaleString('fr-FR')}
                </CardDescription>
              </div>
              
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreColor(report.score) === 'green' ? 'text-green-600' : 
                  getScoreColor(report.score) === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {report.score}
                </div>
                <Badge variant={getScoreVariant(report.score)}>
                  {report.wcagLevel}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{report.passedChecks}</div>
                <div className="text-sm text-muted-foreground">Vérifications réussies</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{report.issues.length}</div>
                <div className="text-sm text-muted-foreground">Problèmes détectés</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{report.totalChecks}</div>
                <div className="text-sm text-muted-foreground">Total vérifications</div>
              </div>
            </div>
            
            <Progress 
              value={(report.passedChecks / report.totalChecks) * 100} 
              className="mt-4"
            />
          </CardHeader>
        </Card>
      )}

      {/* Alertes pour problèmes critiques */}
      {criticalIssues.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Problèmes Critiques Détectés</AlertTitle>
          <AlertDescription>
            {criticalIssues.length} problème(s) critique(s) empêchent l'accès pour les utilisateurs en situation de handicap. 
            Correction immédiate recommandée.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="issues">Problèmes</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="tools">Outils</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {report && report.issues.length > 0 ? (
            <div className="grid gap-4">
              {report.issues.map((issue, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader 
                    className="pb-3"
                    onClick={() => setSelectedIssue(selectedIssue === issue ? null : issue)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getImpactIcon(issue.impact)}
                        <div className="flex-1">
                          <CardTitle className="text-base">{issue.description}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              WCAG {issue.wcagCriterion}
                            </Badge>
                            <Badge 
                              variant={issue.impact === 'critical' ? 'destructive' : 
                                     issue.impact === 'serious' ? 'secondary' : 'outline'}
                              className="text-xs capitalize"
                            >
                              {issue.impact}
                            </Badge>
                            {issue.fixable && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Correction auto
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {issue.fixable && autoFixEnabled && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAutoFix(issue.id);
                          }}
                          className="gap-1"
                        >
                          <Zap className="h-3 w-3" />
                          Corriger
                        </Button>
                      )}
                    </div>
                    
                    {selectedIssue === issue && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm mb-2">
                          <strong>Recommandation:</strong> {issue.recommendation}
                        </p>
                        {issue.element && (
                          <p className="text-xs text-muted-foreground">
                            Élément concerné: {issue.element.tagName.toLowerCase()}
                            {issue.element.className && ` (classe: ${issue.element.className})`}
                          </p>
                        )}
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : report ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Excellent travail !</h3>
                <p className="text-muted-foreground">
                  Aucun problème d'accessibilité détecté sur cette page.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune vérification effectuée</h3>
                <p className="text-muted-foreground mb-4">
                  Cliquez sur "Vérifier" pour lancer l'audit d'accessibilité.
                </p>
                <Button onClick={checkAccessibility} disabled={isChecking}>
                  Démarrer la vérification
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Préférences Utilisateur Détectées
                </CardTitle>
                <CardDescription>
                  Préférences d'accessibilité détectées automatiquement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Mouvement réduit</span>
                  </div>
                  <Badge variant={preferences.reducedMotion ? 'default' : 'outline'}>
                    {preferences.reducedMotion ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>Contraste élevé</span>
                  </div>
                  <Badge variant={preferences.highContrast ? 'default' : 'outline'}>
                    {preferences.highContrast ? 'Activé' : 'Désactivé'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Lecteur d'écran détecté</span>
                  </div>
                  <Badge variant={preferences.screenReader ? 'default' : 'outline'}>
                    {preferences.screenReader ? 'Probable' : 'Non détecté'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Options de Vérification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Corrections automatiques</div>
                    <div className="text-sm text-muted-foreground">
                      Permettre les corrections automatiques pour les problèmes simples
                    </div>
                  </div>
                  <Switch 
                    checked={autoFixEnabled}
                    onCheckedChange={setAutoFixEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Multi-Appareils</CardTitle>
              <CardDescription>
                Simulez l'expérience sur différents types d'appareils
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={currentDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentDevice('desktop')}
                  className="gap-1"
                >
                  <Monitor className="h-3 w-3" />
                  Bureau
                </Button>
                <Button 
                  variant={currentDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentDevice('tablet')}
                  className="gap-1"
                >
                  <Tablet className="h-3 w-3" />
                  Tablette
                </Button>
                <Button 
                  variant={currentDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentDevice('mobile')}
                  className="gap-1"
                >
                  <Smartphone className="h-3 w-3" />
                  Mobile
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm">
                  <strong>Appareil sélectionné:</strong> {currentDevice}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Les vérifications d'accessibilité s'adapteront aux spécificités de cet appareil.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Évolution du Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {historicalData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm">
                      {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={entry.score} className="w-20" />
                      <span className="text-sm font-medium w-12">{entry.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Outils d'Accessibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Simulateur de déficience visuelle
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Test de lecteur d'écran
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Monitor className="h-4 w-4 mr-2" />
                  Test de contraste
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rapports et Conformité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Rapport WCAG détaillé
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Certificat de conformité
                </Button>
                
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyse comparative
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessibilityDashboard;