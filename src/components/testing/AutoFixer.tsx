import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle, AlertTriangle, Code } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

interface Fix {
  id: string;
  route: string;
  issue: string;
  solution: string;
  code?: string;
  applied: boolean;
  severity: 'low' | 'medium' | 'high';
}

export const AutoFixer: React.FC = () => {
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  const generateMissingPages = useCallback(() => {
    const pagesToCreate = [
      { route: 'ONBOARDING', path: '/onboarding', file: 'OnboardingPage' },
      { route: 'B2B', path: '/b2b', file: 'B2BLandingPage' },
      { route: 'BOSS_LEVEL_GRIT', path: '/boss-level-grit', file: 'BossLevelGritPage' },
      { route: 'MOOD_MIXER', path: '/mood-mixer', file: 'MoodMixerPage' },
      { route: 'AMBITION_ARCADE', path: '/ambition-arcade', file: 'AmbitionArcadePage' },
      { route: 'BOUNCE_BACK_BATTLE', path: '/bounce-back-battle', file: 'BounceBackBattlePage' },
      { route: 'STORY_SYNTH_LAB', path: '/story-synth-lab', file: 'StorySynthLabPage' },
      { route: 'FLASH_GLOW', path: '/flash-glow', file: 'FlashGlowPage' },
      { route: 'AR_FILTERS', path: '/ar-filters', file: 'ARFiltersPage' },
      { route: 'BUBBLE_BEAT', path: '/bubble-beat', file: 'BubbleBeatPage' },
      { route: 'SCREEN_SILK_BREAK', path: '/screen-silk-break', file: 'ScreenSilkBreakPage' },
      { route: 'VR_GALACTIQUE', path: '/vr-galactique', file: 'VRGalactiquePage' },
      { route: 'INSTANT_GLOW', path: '/instant-glow', file: 'InstantGlowPage' },
      { route: 'WEEKLY_BARS', path: '/weekly-bars', file: 'WeeklyBarsPage' },
      { route: 'HEATMAP_VIBES', path: '/heatmap-vibes', file: 'HeatmapVibesPage' },
      { route: 'BREATHWORK', path: '/breathwork', file: 'BreathworkPage' },
      { route: 'PRIVACY_TOGGLES', path: '/privacy-toggles', file: 'PrivacyTogglesPage' },
      { route: 'EXPORT_CSV', path: '/export-csv', file: 'DataExportPage' },
      { route: 'ACCOUNT_DELETE', path: '/account/delete', file: 'AccountDeletionPage' },
      { route: 'HEALTH_CHECK_BADGE', path: '/health-check-badge', file: 'PlatformStatusPage' },
      { route: 'PROFILE_SETTINGS', path: '/profile-settings', file: 'ProfileSettingsPage' },
      { route: 'ACTIVITY_HISTORY', path: '/activity-history', file: 'ActivityHistoryPage' },
      { route: 'FEEDBACK', path: '/feedback', file: 'InAppFeedbackPage' },
      { route: 'SECURITY', path: '/security', file: 'SecurityDashboardPage' },
      { route: 'AUDIT', path: '/audit', file: 'SystemAuditPage' },
      { route: 'ACCESSIBILITY', path: '/accessibility', file: 'AccessibilityPage' }
    ];

    return pagesToCreate.map(page => ({
      id: `create-${page.route}`,
      route: page.path,
      issue: `Page manquante: ${page.file}`,
      solution: `Créer la page ${page.file} avec le template de base`,
      code: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ${page.file}: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              ${page.route.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Cette page est en cours de développement.
              </p>
              <Button onClick={() => window.history.back()}>
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ${page.file};`,
      applied: false,
      severity: 'high' as const
    }));
  }, []);

  const analyzeIssues = useCallback(async () => {
    setIsAnalyzing(true);
    
    // Simuler l'analyse
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newFixes = generateMissingPages();
    
    // Ajouter d'autres fixes communs
    newFixes.push({
      id: 'fix-navigation',
      route: '/',
      issue: 'Navigation principale manquante sur certaines pages',
      solution: 'Ajouter la navigation globale avec liens vers toutes les sections',
      applied: false,
      severity: 'medium'
    });

    newFixes.push({
      id: 'fix-loading-states',
      route: '*',
      issue: 'États de chargement inconsistants',
      solution: 'Standardiser les composants de chargement',
      applied: false,
      severity: 'low'
    });

    setFixes(newFixes);
    setIsAnalyzing(false);
  }, [generateMissingPages]);

  const applyFix = useCallback(async (fixId: string) => {
    setIsFixing(true);
    
    const fix = fixes.find(f => f.id === fixId);
    if (!fix) return;

    // Simuler l'application du fix
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setFixes(prev => prev.map(f => 
      f.id === fixId ? { ...f, applied: true } : f
    ));
    
    setIsFixing(false);
  }, [fixes]);

  const applyAllFixes = useCallback(async () => {
    setIsFixing(true);
    
    for (const fix of fixes) {
      if (!fix.applied) {
        await applyFix(fix.id);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setIsFixing(false);
  }, [fixes, applyFix]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Wrench className="h-4 w-4" />;
      case 'low': return <Code className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const highPriorityFixes = fixes.filter(f => f.severity === 'high' && !f.applied);
  const mediumPriorityFixes = fixes.filter(f => f.severity === 'medium' && !f.applied);
  const lowPriorityFixes = fixes.filter(f => f.severity === 'low' && !f.applied);
  const appliedFixes = fixes.filter(f => f.applied);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Correcteur Automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={analyzeIssues} 
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser les problèmes'}
            </Button>
            {fixes.length > 0 && (
              <Button 
                onClick={applyAllFixes} 
                disabled={isFixing || fixes.every(f => f.applied)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Appliquer tous les correctifs
              </Button>
            )}
          </div>

          {fixes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold text-red-500">{highPriorityFixes.length}</p>
                      <p className="text-sm text-muted-foreground">Priorité haute</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-500">{mediumPriorityFixes.length}</p>
                      <p className="text-sm text-muted-foreground">Priorité moyenne</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{lowPriorityFixes.length}</p>
                      <p className="text-sm text-muted-foreground">Priorité basse</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-green-500">{appliedFixes.length}</p>
                      <p className="text-sm text-muted-foreground">Corrigés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {fixes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Correctifs disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fixes.map((fix) => (
                <div key={fix.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(fix.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{fix.issue}</span>
                        <Badge variant={getSeverityColor(fix.severity)}>
                          {fix.severity}
                        </Badge>
                        {fix.applied && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Appliqué
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{fix.solution}</p>
                      <p className="text-xs text-muted-foreground mt-1">Route: {fix.route}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => applyFix(fix.id)}
                    disabled={fix.applied || isFixing}
                    size="sm"
                    variant={fix.applied ? "outline" : "default"}
                  >
                    {fix.applied ? 'Appliqué' : 'Corriger'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {fixes.some(f => f.code) && (
        <Card>
          <CardHeader>
            <CardTitle>Code généré</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fixes.filter(f => f.code && f.applied).map((fix) => (
                <div key={fix.id} className="border rounded">
                  <div className="p-3 bg-muted">
                    <h4 className="font-medium">{fix.issue}</h4>
                  </div>
                  <pre className="p-4 text-xs overflow-x-auto bg-background">
                    <code>{fix.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};