// @ts-nocheck
import { useState } from 'react';
import { usePseudonymization, PseudonymizationAlgorithm } from '@/hooks/usePseudonymization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Plus, TestTube, Trash2, RefreshCw, Lock, Unlock, Activity } from 'lucide-react';

export const PseudonymizationManager = () => {
  const {
    rules,
    logs,
    stats,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
    pseudonymize,
    depseudonymize,
    rotateKey,
    testRule
  } = usePseudonymization();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  
  const [newRule, setNewRule] = useState({
    data_type: 'email',
    field_name: '',
    algorithm: 'aes256' as PseudonymizationAlgorithm,
    is_reversible: true,
    auto_apply: false,
    retention_days: null,
    description: ''
  });

  const [testData, setTestData] = useState({
    ruleId: '',
    value: '',
    result: null as any
  });

  const handleCreateRule = async () => {
    const result = await createRule(newRule);
    if (result) {
      setIsCreateDialogOpen(false);
      setNewRule({
        data_type: 'email',
        field_name: '',
        algorithm: 'aes256',
        is_reversible: true,
        auto_apply: false,
        retention_days: null,
        description: ''
      });
    }
  };

  const handleTestRule = async () => {
    const result = await testRule(testData.ruleId, testData.value);
    setTestData(prev => ({ ...prev, result }));
  };

  const algorithmLabels = {
    aes256: 'AES-256-GCM (Fort)',
    hmac: 'HMAC-SHA256',
    tokenization: 'Tokenization',
    format_preserving: 'Format-Preserving'
  };

  const dataTypeLabels = {
    email: 'Email',
    phone: 'Téléphone',
    name: 'Nom',
    address: 'Adresse',
    custom: 'Personnalisé'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Pseudonymisation Automatique
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestion des règles de pseudonymisation avec algorithmes réversibles
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle règle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une règle de pseudonymisation</DialogTitle>
              <DialogDescription>
                Configurez une règle pour pseudonymiser automatiquement les données personnelles
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type de données</Label>
                  <Select
                    value={newRule.data_type}
                    onValueChange={(value) => setNewRule({ ...newRule, data_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(dataTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nom du champ</Label>
                  <Input
                    value={newRule.field_name}
                    onChange={(e) => setNewRule({ ...newRule, field_name: e.target.value })}
                    placeholder="user_email"
                  />
                </div>
              </div>
              
              <div>
                <Label>Algorithme de pseudonymisation</Label>
                <Select
                  value={newRule.algorithm}
                  onValueChange={(value) => setNewRule({ ...newRule, algorithm: value as PseudonymizationAlgorithm })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(algorithmLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Réversible</Label>
                  <p className="text-sm text-muted-foreground">
                    Permet de récupérer les données originales
                  </p>
                </div>
                <Switch
                  checked={newRule.is_reversible}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, is_reversible: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Application automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Applique la pseudonymisation automatiquement
                  </p>
                </div>
                <Switch
                  checked={newRule.auto_apply}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, auto_apply: checked })}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Description de la règle..."
                />
              </div>

              <Button onClick={handleCreateRule} disabled={isLoading} className="w-full">
                {isLoading ? 'Création...' : 'Créer la règle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Règles actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</div>
            <p className="text-xs text-muted-foreground">sur {rules.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total pseudonymisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.reduce((acc, s) => acc + Number(s.total_pseudonymized), 0)}
            </div>
            <p className="text-xs text-muted-foreground">enregistrements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dépseudonymisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.reduce((acc, s) => acc + Number(s.total_depseudonymized), 0)}
            </div>
            <p className="text-xs text-muted-foreground">accès aux données originales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.reduce((acc, s) => acc + Number(s.avg_processing_time), 0) / (stats.length || 1)).toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">par opération</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles</TabsTrigger>
          <TabsTrigger value="logs">Logs d'audit</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Règles de pseudonymisation</CardTitle>
              <CardDescription>
                Configurez les règles pour chaque type de données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Champ</TableHead>
                    <TableHead>Algorithme</TableHead>
                    <TableHead>Réversible</TableHead>
                    <TableHead>Auto</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Badge variant="outline">{dataTypeLabels[rule.data_type] || rule.data_type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rule.field_name}</TableCell>
                      <TableCell>{algorithmLabels[rule.algorithm]}</TableCell>
                      <TableCell>
                        {rule.is_reversible ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.auto_apply && <Badge variant="secondary">Auto</Badge>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTestData({ ruleId: rule.id, value: '', result: null });
                              setIsTestDialogOpen(true);
                            }}
                          >
                            <TestTube className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rotateKey(rule.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRule(rule.id, { is_active: !rule.is_active })}
                          >
                            {rule.is_active ? <Activity className="h-3 w-3" /> : <Activity className="h-3 w-3 text-gray-400" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'audit</CardTitle>
              <CardDescription>
                Historique de toutes les opérations de pseudonymisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Opération</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Champ</TableHead>
                    <TableHead>Enregistrements</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 50).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.performed_at).toLocaleString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.operation}</Badge>
                      </TableCell>
                      <TableCell>{log.data_type}</TableCell>
                      <TableCell className="font-mono text-sm">{log.field_name}</TableCell>
                      <TableCell>{log.records_affected}</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Succès' : 'Échec'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tester la pseudonymisation</CardTitle>
              <CardDescription>
                Testez vos règles avec des données d'exemple
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sélectionner une règle</Label>
                <Select
                  value={testData.ruleId}
                  onValueChange={(value) => setTestData({ ...testData, ruleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une règle" />
                  </SelectTrigger>
                  <SelectContent>
                    {rules.filter(r => r.is_active).map((rule) => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.data_type} - {rule.field_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valeur à pseudonymiser</Label>
                <Input
                  value={testData.value}
                  onChange={(e) => setTestData({ ...testData, value: e.target.value })}
                  placeholder="Entrez une valeur..."
                />
              </div>
              <Button onClick={handleTestRule} disabled={!testData.ruleId || isLoading}>
                <TestTube className="h-4 w-4 mr-2" />
                Tester
              </Button>

              {testData.result && (
                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <div>
                    <strong>Original:</strong>
                    <code className="block mt-1 p-2 bg-background rounded">
                      {testData.result.original}
                    </code>
                  </div>
                  <div>
                    <strong>Pseudonymisé:</strong>
                    <code className="block mt-1 p-2 bg-background rounded break-all">
                      {testData.result.pseudonymized}
                    </code>
                  </div>
                  <div>
                    <strong>Récupéré:</strong>
                    <code className="block mt-1 p-2 bg-background rounded">
                      {testData.result.recovered}
                    </code>
                  </div>
                  <div>
                    <Badge variant={testData.result.success ? 'default' : 'destructive'}>
                      {testData.result.success ? '✓ Test réussi' : '✗ Échec'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de test */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tester la règle</DialogTitle>
            <DialogDescription>
              Testez rapidement cette règle de pseudonymisation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Valeur de test</Label>
              <Input
                value={testData.value}
                onChange={(e) => setTestData({ ...testData, value: e.target.value })}
                placeholder="Entrez une valeur..."
              />
            </div>
            <Button onClick={handleTestRule} disabled={isLoading} className="w-full">
              Tester
            </Button>
            {testData.result && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="text-sm space-y-1">
                  <div><strong>Original:</strong> {testData.result.original}</div>
                  <div><strong>Pseudonymisé:</strong> {testData.result.pseudonymized}</div>
                  <div><strong>Récupéré:</strong> {testData.result.recovered}</div>
                </div>
                <Badge variant={testData.result.success ? 'default' : 'destructive'}>
                  {testData.result.success ? 'Succès' : 'Échec'}
                </Badge>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
