import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Brain, CheckCircle2, XCircle, Clock, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AISuggestion {
  id: string;
  pattern_name: string;
  error_pattern: {
    type: string;
    message: string;
    severity: string;
  };
  suggested_template: {
    email: { subject: string; body: string };
    slack: string;
    resolution: string[];
    priority: string;
  };
  confidence_score: number;
  occurrences: number;
  status: string;
  sample_errors: any[];
  created_at: string;
  last_seen_at: string;
}

export default function AITemplateSuggestions() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_template_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-error-patterns');

      if (error) throw error;

      toast({
        title: 'Analyse terminée',
        description: `${data.suggestions_generated} nouvelles suggestions générées`,
      });

      await loadSuggestions();
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('ai_template_suggestions')
        .update({
          status,
          ...(status === 'applied' && { applied_at: new Date().toISOString() }),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Statut mis à jour',
        description: `Suggestion ${status === 'approved' ? 'approuvée' : status === 'rejected' ? 'rejetée' : 'appliquée'}`,
      });

      await loadSuggestions();
      setSelectedSuggestion(null);
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> En attente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" /> Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejetée</Badge>;
      case 'applied':
        return <Badge variant="secondary"><Sparkles className="h-3 w-3 mr-1" /> Appliquée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const approvedSuggestions = suggestions.filter(s => s.status === 'approved');
  const appliedSuggestions = suggestions.filter(s => s.status === 'applied');

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Suggestions IA de Templates
          </h1>
          <p className="text-muted-foreground mt-2">
            L'IA analyse les patterns d'erreurs et suggère des templates optimisés
          </p>
        </div>
        <Button onClick={triggerAnalysis} disabled={analyzing}>
          {analyzing ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Analyse en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Lancer l'analyse
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total suggestions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSuggestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedSuggestions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appliquées</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedSuggestions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            En attente ({pendingSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approuvées ({approvedSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Toutes ({suggestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSuggestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune suggestion en attente
              </CardContent>
            </Card>
          ) : (
            pendingSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onView={() => setSelectedSuggestion(suggestion)}
                onApprove={() => updateStatus(suggestion.id, 'approved')}
                onReject={() => updateStatus(suggestion.id, 'rejected')}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onView={() => setSelectedSuggestion(suggestion)}
              onApply={() => updateStatus(suggestion.id, 'applied')}
            />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onView={() => setSelectedSuggestion(suggestion)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal de détails */}
      {selectedSuggestion && (
        <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedSuggestion.pattern_name}
                {getStatusBadge(selectedSuggestion.status)}
              </DialogTitle>
              <DialogDescription>
                Pattern détecté {selectedSuggestion.occurrences} fois
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Pattern d'erreur</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Type:</strong> {selectedSuggestion.error_pattern.type}</p>
                  <p><strong>Message:</strong> {selectedSuggestion.error_pattern.message}</p>
                  <p><strong>Sévérité:</strong> {selectedSuggestion.error_pattern.severity}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Template Email suggéré</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Sujet:</strong> {selectedSuggestion.suggested_template.email.subject}</p>
                  <p><strong>Corps:</strong></p>
                  <pre className="whitespace-pre-wrap bg-background p-2 rounded">
                    {selectedSuggestion.suggested_template.email.body}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Suggestions de résolution</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedSuggestion.suggested_template.resolution?.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Confidence de l'IA</h3>
                <div className="space-y-2">
                  <Progress value={selectedSuggestion.confidence_score * 100} />
                  <p className="text-sm text-muted-foreground">
                    {(selectedSuggestion.confidence_score * 100).toFixed(0)}% de confiance
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: AISuggestion;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onApply?: () => void;
}

function SuggestionCard({ suggestion, onView, onApprove, onReject, onApply }: SuggestionCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> En attente</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" /> Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejetée</Badge>;
      case 'applied':
        return <Badge variant="secondary"><Sparkles className="h-3 w-3 mr-1" /> Appliquée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {suggestion.pattern_name}
              {getStatusBadge(suggestion.status)}
            </CardTitle>
            <CardDescription>
              {suggestion.error_pattern.type} - {suggestion.occurrences} occurrences
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
            {onApprove && (
              <Button variant="default" size="sm" onClick={onApprove}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            )}
            {onReject && (
              <Button variant="destructive" size="sm" onClick={onReject}>
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            )}
            {onApply && (
              <Button variant="secondary" size="sm" onClick={onApply}>
                <Sparkles className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>Confiance: {(suggestion.confidence_score * 100).toFixed(0)}%</span>
            </div>
            <Badge variant="outline">{suggestion.suggested_template.priority}</Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2">
            {suggestion.suggested_template.email.subject}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
