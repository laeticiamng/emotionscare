import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Brain, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface MLAssignmentRule {
  id: string;
  rule_name: string;
  alert_type: string;
  alert_category: string;
  priority_level: string[];
  matching_conditions: Record<string, unknown>;
  use_ml_recommendation: boolean;
  ml_confidence_threshold: number;
  preferred_assignees: string[];
  fallback_assignees: string[];
  auto_assign: boolean;
  respect_availability: boolean;
  respect_workload: boolean;
  max_response_time_minutes: number | null;
  is_active: boolean;
  priority: number;
}

const MLAssignmentRulesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MLAssignmentRule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    rule_name: string;
    alert_type: string;
    alert_category: string;
    priority_level: string[];
    matching_conditions: Record<string, unknown>;
    use_ml_recommendation: boolean;
    ml_confidence_threshold: number;
    preferred_assignees: string[];
    fallback_assignees: string[];
    auto_assign: boolean;
    respect_availability: boolean;
    respect_workload: boolean;
    max_response_time_minutes: number | null;
    is_active: boolean;
    priority: number;
  }>({
    rule_name: '',
    alert_type: '',
    alert_category: '',
    priority_level: ['critical'],
    matching_conditions: {},
    use_ml_recommendation: true,
    ml_confidence_threshold: 0.70,
    preferred_assignees: [],
    fallback_assignees: [],
    auto_assign: true,
    respect_availability: true,
    respect_workload: true,
    max_response_time_minutes: null,
    is_active: true,
    priority: 100
  });

  const { data: rules, isLoading } = useQuery({
    queryKey: ['ml-assignment-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ml_assignment_rules')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: _teamMembers } = useQuery({
    queryKey: ['team-member-skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_member_skills')
        .select('*')
        .eq('is_active', true)
        .order('performance_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: assignmentHistory } = useQuery({
    queryKey: ['ml-assignment-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ml_assignment_history')
        .select('*, team_member_skills(name)')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('ml_assignment_rules')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ml-assignment-rules'] });
      toast.success('Règle créée avec succès');
      resetForm();
    },
    onError: (error) => {
      logger.error('Create rule error:', error, 'PAGE');
      toast.error('Erreur lors de la création');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('ml_assignment_rules')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ml-assignment-rules'] });
      toast.success('Règle mise à jour');
      resetForm();
    },
    onError: (error) => {
      logger.error('Update rule error:', error, 'PAGE');
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ml_assignment_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ml-assignment-rules'] });
      toast.success('Règle supprimée');
    },
    onError: (error) => {
      logger.error('Delete rule error:', error, 'PAGE');
      toast.error('Erreur lors de la suppression');
    }
  });

  const resetForm = () => {
    setFormData({
      rule_name: '',
      alert_type: '',
      alert_category: '',
      priority_level: ['critical'],
      matching_conditions: {},
      use_ml_recommendation: true,
      ml_confidence_threshold: 0.70,
      preferred_assignees: [],
      fallback_assignees: [],
      auto_assign: true,
      respect_availability: true,
      respect_workload: true,
      max_response_time_minutes: null,
      is_active: true,
      priority: 100
    });
    setEditingRule(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (rule: MLAssignmentRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ruleToDelete) {
      deleteMutation.mutate(ruleToDelete);
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Règles d'Assignation ML
          </h1>
          <p className="text-muted-foreground">
            Configurez les règles intelligentes pour assigner automatiquement les alertes aux membres de l'équipe
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle règle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? 'Modifier la règle' : 'Nouvelle règle d\'assignation ML'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule_name">Nom de la règle</Label>
                <Input
                  id="rule_name"
                  value={formData.rule_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
                  placeholder="Ex: Erreurs DB critiques → Expert PostgreSQL"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert_type">Type d'alerte</Label>
                  <Input
                    id="alert_type"
                    value={formData.alert_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, alert_type: e.target.value }))}
                    placeholder="database_error, api_error, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert_category">Catégorie</Label>
                  <Select
                    value={formData.alert_category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, alert_category: value }))}
                  >
                    <SelectTrigger id="alert_category">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Conditions de matching (JSON)</Label>
                <Textarea
                  value={JSON.stringify(formData.matching_conditions, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData(prev => ({ ...prev, matching_conditions: parsed }));
                    } catch (error) {
                      logger.warn('Invalid JSON in matching conditions', error as Error, 'UI');
                    }
                  }}
                  placeholder='{"severity": "critical", "tags": ["database"]}'
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="use_ml">Utiliser ML</Label>
                  <Switch
                    id="use_ml"
                    checked={formData.use_ml_recommendation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, use_ml_recommendation: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto_assign">Auto-assigner</Label>
                  <Switch
                    id="auto_assign"
                    checked={formData.auto_assign}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_assign: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="respect_availability">Respecter disponibilité</Label>
                  <Switch
                    id="respect_availability"
                    checked={formData.respect_availability}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, respect_availability: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="respect_workload">Respecter charge</Label>
                  <Switch
                    id="respect_workload"
                    checked={formData.respect_workload}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, respect_workload: checked }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threshold">Seuil de confiance ML</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.ml_confidence_threshold}
                    onChange={(e) => setFormData(prev => ({ ...prev, ml_confidence_threshold: parseFloat(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sla">SLA (minutes)</Label>
                  <Input
                    id="sla"
                    type="number"
                    value={formData.max_response_time_minutes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_response_time_minutes: e.target.value ? parseInt(e.target.value) : null }))}
                    placeholder="Ex: 30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Label htmlFor="is_active">Règle active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingRule ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Chargement...</CardContent>
          </Card>
        ) : !rules || rules.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              Aucune règle configurée. Créez votre première règle d'assignation ML.
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{rule.rule_name}</CardTitle>
                    <CardDescription>
                      {rule.alert_type} • {rule.alert_category}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(rule)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ML Confiance</p>
                    <p className="font-semibold">{(rule.ml_confidence_threshold * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Auto-assign</p>
                    <p className="font-semibold">{rule.auto_assign ? 'Oui' : 'Non'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SLA</p>
                    <p className="font-semibold">{rule.max_response_time_minutes || 'N/A'} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assignment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historique des Assignations ML
          </CardTitle>
          <CardDescription>10 dernières assignations automatiques</CardDescription>
        </CardHeader>
        <CardContent>
          {!assignmentHistory || assignmentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune assignation pour le moment</p>
          ) : (
            <div className="space-y-3">
              {assignmentHistory.map((history) => (
                <div key={history.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        {history.team_member_skills?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {history.assignment_method} • Confiance: {(history.ml_confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                    <Badge variant={history.was_successful ? 'default' : 'secondary'}>
                      {history.was_successful ? 'Succès' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette règle d'assignation ML ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRuleToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MLAssignmentRulesPage;
