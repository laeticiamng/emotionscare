import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FlaskConical, Play, Square, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const ABTestManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    control_rule_id: '',
    variant_rule_id: '',
    min_sample_size: 100,
    confidence_level: 0.95
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['ab-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ab_test_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: rules } = useQuery({
    queryKey: ['escalation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_escalation_rules')
        .select('id, rule_name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('ab_test_configurations')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
      toast.success('Test A/B créé');
      setIsDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        control_rule_id: '',
        variant_rule_id: '',
        min_sample_size: 100,
        confidence_level: 0.95
      });
    }
  });

  const startMutation = useMutation({
    mutationFn: async (testId: string) => {
      const { error } = await supabase
        .from('ab_test_configurations')
        .update({ 
          status: 'running',
          start_date: new Date().toISOString()
        })
        .eq('id', testId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
      toast.success('Test démarré');
    }
  });

  const stopMutation = useMutation({
    mutationFn: async (testId: string) => {
      const { error } = await supabase
        .from('ab_test_configurations')
        .update({ 
          status: 'cancelled',
          end_date: new Date().toISOString()
        })
        .eq('id', testId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
      toast.success('Test arrêté');
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (testId: string) => {
      const { data, error } = await supabase.functions.invoke('ab-test-manager', {
        body: { action: 'analyze', test_id: testId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
      toast.success(data.recommendation);
    }
  });

  const selectWinnerMutation = useMutation({
    mutationFn: async (testId: string) => {
      const { data, error } = await supabase.functions.invoke('ab-test-manager', {
        body: { action: 'select_winner', test_id: testId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });
      toast.success(data.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { label: 'Brouillon', variant: 'outline' as const },
      running: { label: 'En cours', variant: 'default' as const },
      completed: { label: 'Terminé', variant: 'secondary' as const },
      cancelled: { label: 'Annulé', variant: 'destructive' as const }
    };
    const config = variants[status as keyof typeof variants] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tests A/B - Règles d'escalade</h1>
          <p className="text-muted-foreground mt-2">
            Comparez différentes configurations et sélectionnez automatiquement la meilleure
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FlaskConical className="h-4 w-4 mr-2" />
              Nouveau test A/B
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un test A/B</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du test</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="control">Règle contrôle (A)</Label>
                <Select
                  value={formData.control_rule_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, control_rule_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rules?.map((rule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.rule_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant">Règle variant (B)</Label>
                <Select
                  value={formData.variant_rule_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, variant_rule_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rules?.map((rule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.rule_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sample">Échantillon min.</Label>
                  <Input
                    id="sample"
                    type="number"
                    value={formData.min_sample_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_sample_size: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence">Confiance</Label>
                  <Input
                    id="confidence"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.confidence_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, confidence_level: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  Créer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {tests?.map((test) => {
          const metadata = test.metadata as any;
          const sampleSize = metadata?.sample_size || 0;
          const progress = (sampleSize / test.min_sample_size) * 100;
          
          return (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-primary" />
                      {test.name}
                      {getStatusBadge(test.status)}
                    </CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {test.status === 'draft' && (
                      <Button size="sm" onClick={() => startMutation.mutate(test.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Démarrer
                      </Button>
                    )}
                    {test.status === 'running' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => analyzeMutation.mutate(test.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Analyser
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => stopMutation.mutate(test.id)}>
                          <Square className="h-4 w-4 mr-1" />
                          Arrêter
                        </Button>
                      </>
                    )}
                    {test.status === 'running' && metadata?.has_min_sample && metadata?.current_winner !== 'inconclusive' && (
                      <Button size="sm" onClick={() => selectWinnerMutation.mutate(test.id)}>
                        <Award className="h-4 w-4 mr-1" />
                        Sélectionner gagnant
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Échantillon collecté</span>
                    <span className="font-medium text-foreground">
                      {sampleSize} / {test.min_sample_size}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                </div>

                {metadata?.control_metrics && metadata?.variant_metrics && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Contrôle (A)</span>
                          {metadata?.current_winner === 'control' && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-medium text-foreground">{metadata.control_metrics.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taux résolution</span>
                          <span className="font-medium text-foreground">
                            {(metadata.control_metrics.resolution_rate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temps moy. résolution</span>
                          <span className="font-medium text-foreground">
                            {(metadata.control_metrics.avg_resolution_time / 60).toFixed(1)}h
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Variant (B)</span>
                          {metadata?.current_winner === 'variant' && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-medium text-foreground">{metadata.variant_metrics.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Taux résolution</span>
                          <span className="font-medium text-foreground">
                            {(metadata.variant_metrics.resolution_rate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Temps moy. résolution</span>
                          <span className="font-medium text-foreground">
                            {(metadata.variant_metrics.avg_resolution_time / 60).toFixed(1)}h
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {metadata?.confidence !== undefined && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Confiance statistique: <strong>{(metadata.confidence * 100).toFixed(1)}%</strong>
                      {metadata.confidence >= test.confidence_level ? ' ✓ Seuil atteint' : ' (seuil: ' + (test.confidence_level * 100) + '%)'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {!tests?.length && (
          <Card>
            <CardContent className="p-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucun test A/B configuré. Créez-en un pour commencer.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ABTestManager;