// @ts-nocheck
import { useState, useEffect } from 'react';
import { usePrivacyPolicyVersions, PrivacyPolicy, PolicyChange } from '@/hooks/usePrivacyPolicyVersions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, History, Users, Plus, Eye, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PrivacyPolicyManager() {
  const {
    policies,
    loadPolicies,
    createPolicy,
    publishPolicy,
    logChanges,
    getPolicyChanges,
    getAcceptanceStats,
  } = usePrivacyPolicyVersions();

  const [selectedPolicy, setSelectedPolicy] = useState<PrivacyPolicy | null>(null);
  const [policyChanges, setPolicyChanges] = useState<PolicyChange[]>([]);
  const [acceptanceStats, setAcceptanceStats] = useState({ total: 0, accepted: 0, pending: 0, percentage: 0 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    version: '',
    title: '',
    content: '',
    summary: '',
    effective_date: new Date().toISOString().split('T')[0],
    requires_acceptance: true,
  });
  const [changes, setChanges] = useState<Array<Omit<PolicyChange, 'id' | 'policy_id' | 'created_at' | 'created_by'>>>([]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  useEffect(() => {
    if (selectedPolicy) {
      loadPolicyDetails(selectedPolicy.id);
    }
  }, [selectedPolicy]);

  const loadPolicyDetails = async (policyId: string) => {
    const [changesData, statsData] = await Promise.all([
      getPolicyChanges(policyId),
      getAcceptanceStats(policyId),
    ]);
    setPolicyChanges(changesData);
    setAcceptanceStats(statsData);
  };

  const handleCreatePolicy = async () => {
    const policy = await createPolicy(newPolicy);
    if (policy && changes.length > 0) {
      await logChanges(policy.id, changes);
    }
    setIsCreateDialogOpen(false);
    setNewPolicy({
      version: '',
      title: '',
      content: '',
      summary: '',
      effective_date: new Date().toISOString().split('T')[0],
      requires_acceptance: true,
    });
    setChanges([]);
  };

  const addChange = () => {
    setChanges([...changes, { change_type: '', section: '', description: '', old_value: '', new_value: '' }]);
  };

  const updateChange = (index: number, field: string, value: string) => {
    const updated = [...changes];
    updated[index] = { ...updated[index], [field]: value };
    setChanges(updated);
  };

  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { label: 'Brouillon', className: 'bg-secondary text-secondary-foreground' },
      published: { label: 'Publiée', className: 'bg-primary text-primary-foreground' },
      archived: { label: 'Archivée', className: 'bg-muted text-muted-foreground' },
    };
    const variant = variants[status] || variants.draft;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des politiques de confidentialité</h2>
          <p className="text-sm text-muted-foreground">Gérez les versions, l'historique et les acceptations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle politique
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle politique</DialogTitle>
              <DialogDescription>
                Créez une nouvelle version de la politique de confidentialité
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    placeholder="ex: 2.0"
                    value={newPolicy.version}
                    onChange={(e) => setNewPolicy({ ...newPolicy, version: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effective_date">Date effective</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={newPolicy.effective_date}
                    onChange={(e) => setNewPolicy({ ...newPolicy, effective_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Politique de confidentialité"
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Résumé</Label>
                <Textarea
                  id="summary"
                  placeholder="Résumé des principaux changements..."
                  value={newPolicy.summary}
                  onChange={(e) => setNewPolicy({ ...newPolicy, summary: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenu complet</Label>
                <Textarea
                  id="content"
                  placeholder="Contenu détaillé de la politique..."
                  value={newPolicy.content}
                  onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
                  rows={10}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_acceptance"
                  checked={newPolicy.requires_acceptance}
                  onCheckedChange={(checked) => setNewPolicy({ ...newPolicy, requires_acceptance: checked })}
                />
                <Label htmlFor="requires_acceptance">Requiert l'acceptation des utilisateurs</Label>
              </div>

              {/* Changements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Historique des changements</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addChange}>
                    <Plus className="mr-2 h-3 w-3" />
                    Ajouter un changement
                  </Button>
                </div>
                {changes.map((change, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Type de changement"
                          value={change.change_type}
                          onChange={(e) => updateChange(index, 'change_type', e.target.value)}
                          className="flex-1 mr-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChange(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Section concernée (optionnel)"
                        value={change.section}
                        onChange={(e) => updateChange(index, 'section', e.target.value)}
                      />
                      <Textarea
                        placeholder="Description du changement"
                        value={change.description}
                        onChange={(e) => updateChange(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreatePolicy}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des politiques */}
      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {policy.title}
                    {policy.is_current && (
                      <Badge variant="outline" className="ml-2">Actuelle</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Version {policy.version} • Effective le{' '}
                    {format(new Date(policy.effective_date), 'dd MMMM yyyy', { locale: fr })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(policy.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policy.summary && (
                  <p className="text-sm text-muted-foreground">{policy.summary}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </Button>
                  {policy.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => publishPolicy(policy.id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publier
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de détails */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.title}</DialogTitle>
            <DialogDescription>
              Version {selectedPolicy?.version} • {getStatusBadge(selectedPolicy?.status || 'draft')}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="content" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">
                <FileText className="mr-2 h-4 w-4" />
                Contenu
              </TabsTrigger>
              <TabsTrigger value="changes">
                <History className="mr-2 h-4 w-4" />
                Changements ({policyChanges.length})
              </TabsTrigger>
              <TabsTrigger value="acceptances">
                <Users className="mr-2 h-4 w-4" />
                Acceptations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {selectedPolicy?.summary && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Résumé</h4>
                    <p className="text-sm text-muted-foreground">{selectedPolicy.summary}</p>
                  </div>
                )}
                <div className="prose prose-sm max-w-none">
                  {selectedPolicy?.content}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="changes" className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {policyChanges.map((change) => (
                  <Card key={change.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <History className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{change.change_type}</Badge>
                            {change.section && (
                              <span className="text-sm text-muted-foreground">• {change.section}</span>
                            )}
                          </div>
                          <p className="text-sm">{change.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(change.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {policyChanges.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucun changement enregistré</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="acceptances" className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{acceptanceStats.total}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Accepté
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{acceptanceStats.accepted}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        En attente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-muted-foreground">{acceptanceStats.pending}</div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Taux d'acceptation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-semibold">{acceptanceStats.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${acceptanceStats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
