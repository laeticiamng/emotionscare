
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAccessibilityValidation } from '@/hooks/useAccessibilityValidation';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Shield, Eye, Keyboard, Volume2 } from 'lucide-react';

const AccessibilityAudit: React.FC = () => {
  const { report, isValidating, validateAccessibility } = useAccessibilityValidation();

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'AA': return 'bg-green-500';
      case 'A': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'serious': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'moderate': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Audit d'Accessibilité WCAG 2.1</span>
            </CardTitle>
            <Button 
              onClick={validateAccessibility} 
              disabled={isValidating}
              variant="outline"
            >
              {isValidating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              {isValidating ? 'Validation...' : 'Lancer l\'audit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {report ? (
            <div className="space-y-6">
              {/* Score global */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Score d'accessibilité</span>
                    <span className="text-2xl font-bold">{report.score}/100</span>
                  </div>
                  <Progress value={report.score} className="h-3" />
                </div>
                <Badge 
                  className={`${getComplianceColor(report.compliance)} text-white`}
                >
                  {report.compliance === 'AA' ? 'WCAG 2.1 AA' : 
                   report.compliance === 'A' ? 'WCAG 2.1 A' : 
                   'Non conforme'}
                </Badge>
              </div>

              {/* Résumé des problèmes */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-semibold text-red-500">
                        {report.issues.filter(i => i.impact === 'critical').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Critiques</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-semibold text-orange-500">
                        {report.issues.filter(i => i.impact === 'serious').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Graves</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-yellow-500">
                        {report.issues.filter(i => i.impact === 'moderate').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Modérés</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-semibold text-green-500">
                        {report.passedRules.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Réussis</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Liste des problèmes */}
              {report.issues.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Problèmes détectés</h4>
                  {report.issues.map((issue, index) => (
                    <Alert key={index} className={
                      issue.impact === 'critical' ? 'border-red-200 bg-red-50' :
                      issue.impact === 'serious' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }>
                      <div className="flex items-start space-x-3">
                        {getImpactIcon(issue.impact)}
                        <div className="flex-1">
                          <AlertDescription>
                            <div className="font-medium">{issue.message}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Règle: {issue.rule}
                            </div>
                            {issue.element && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Élément: {issue.element}
                              </div>
                            )}
                          </AlertDescription>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {issue.impact}
                        </Badge>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommandations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Améliorer la visibilité</div>
                      <div className="text-sm text-muted-foreground">
                        Activez le contraste élevé et ajustez la taille de police pour une meilleure lisibilité
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Keyboard className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Navigation clavier</div>
                      <div className="text-sm text-muted-foreground">
                        Assurez-vous que tous les éléments sont accessibles au clavier
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Volume2 className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <div className="font-medium">Support audio</div>
                      <div className="text-sm text-muted-foreground">
                        Activez le lecteur d'écran et les descriptions audio
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Cliquez sur "Lancer l'audit" pour évaluer l'accessibilité
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityAudit;
