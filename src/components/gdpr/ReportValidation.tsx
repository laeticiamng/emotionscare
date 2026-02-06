import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ValidationCheck {
  criterion: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  details: string;
}

interface Recommendation {
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  action: string;
  impact: string;
}

interface ValidationResult {
  compliance_checks: ValidationCheck[];
  recommendations: Recommendation[];
  overall_assessment: string;
  immediate_actions?: string[];
}

export function ReportValidation({ reportData }: { reportData: any }) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateReport = async () => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-report-ai', {
        body: { reportData },
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Limite de requêtes atteinte, réessayez dans quelques instants.');
        } else if (error.message?.includes('402')) {
          toast.error('Crédits IA épuisés. Veuillez recharger votre compte.');
        } else {
          toast.error('Erreur lors de la validation: ' + error.message);
        }
        return;
      }

      setValidation(data.validation);
      toast.success('Validation IA complétée');
    } catch (error: unknown) {
      toast.error('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Validation Automatique IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!validation ? (
            <Button onClick={validateReport} disabled={isValidating} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {isValidating ? 'Validation en cours...' : 'Valider avec IA'}
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Évaluation Globale</p>
                <p className="text-sm text-muted-foreground">{validation.overall_assessment}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Checklist de Conformité</h3>
                <div className="space-y-2">
                  {validation.compliance_checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getStatusIcon(check.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{check.criterion}</span>
                          <span className="text-sm font-semibold">{check.score}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{check.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {validation.immediate_actions && validation.immediate_actions.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Actions Immédiates Requises</h3>
                  <ul className="space-y-1">
                    {validation.immediate_actions.map((action, i) => (
                      <li key={i} className="text-sm text-red-800">• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Recommandations</h3>
                <div className="space-y-3">
                  {validation.recommendations.map((rec, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium">{rec.title}</span>
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.action}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Catégorie: {rec.category}</span>
                        <span>Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={validateReport} variant="outline" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Revalider
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
