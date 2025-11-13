import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Play, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const AlertTesterPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    alert_type: 'database_error',
    severity: 'critical',
    title: 'Test Critical Database Error',
    message: 'This is a test critical alert to verify the automated incident detection workflow',
    source: 'manual_test',
    tags: ['test', 'critical', 'database'],
    metadata: {
      test: true,
      created_by: 'admin_tester',
      purpose: 'workflow_validation'
    }
  });

  const { data: recentIncidents } = useQuery({
    queryKey: ['recent-test-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  const { data: recentTickets } = useQuery({
    queryKey: ['recent-test-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_created_tickets')
        .select('*, unified_alerts(*)')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000
  });

  const createTestAlert = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('unified_alerts')
        .insert({
          alert_type: formData.alert_type,
          severity: formData.severity,
          title: formData.title,
          message: formData.message,
          source: formData.source,
          tags: formData.tags,
          metadata: formData.metadata,
          status: 'active',
          priority: 'critical'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`✅ Alerte critique créée avec succès (ID: ${data.id.slice(0, 8)}...)`);
      toast.info('⏱️ Le détecteur proactif va analyser cette alerte dans les 5 prochaines minutes');
      queryClient.invalidateQueries({ queryKey: ['recent-test-incidents'] });
      queryClient.invalidateQueries({ queryKey: ['recent-test-tickets'] });
    },
    onError: (error: any) => {
      console.error('Create test alert error:', error);
      toast.error(`❌ Erreur: ${error.message}`);
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          Testeur d'Alertes Critiques
        </h1>
        <p className="text-muted-foreground">
          Créez une alerte critique manuelle pour tester le workflow automatique: Alerte → Détection → Incident → Ticket → Assignation ML
        </p>
      </div>

      {/* Alert Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Créer une Alerte de Test</CardTitle>
          <CardDescription>
            Cette alerte sera détectée automatiquement par le système proactif dans les 5 prochaines minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alert_type">Type d'Alerte</Label>
              <Select
                value={formData.alert_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, alert_type: value }))}
              >
                <SelectTrigger id="alert_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database_error">Database Error</SelectItem>
                  <SelectItem value="api_error">API Error</SelectItem>
                  <SelectItem value="performance">Performance Issue</SelectItem>
                  <SelectItem value="security_alert">Security Alert</SelectItem>
                  <SelectItem value="system_error">System Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Sévérité</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
            />
          </div>

          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Workflow automatique:</strong><br />
              1. Alerte créée → 2. Détectée par cron job (max 5 min) → 3. Rapport d'incident généré (ML) → 4. Ticket créé → 5. Assignation ML
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => createTestAlert.mutate()}
            disabled={createTestAlert.isPending}
            className="w-full"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {createTestAlert.isPending ? 'Création en cours...' : 'Créer l\'alerte critique de test'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Incidents Récents Générés</span>
            <Badge variant="outline">Auto-refresh: 5s</Badge>
          </CardTitle>
          <CardDescription>
            Les incidents sont générés automatiquement par l'edge function "proactive-incident-detector"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recentIncidents || recentIncidents.length === 0 ? (
            <Alert>
              <AlertDescription>
                Aucun incident détecté pour le moment. Créez une alerte critique ci-dessus et attendez 5 minutes maximum.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{incident.title}</p>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <Badge variant="outline">{incident.severity}</Badge>
                        <span>•</span>
                        <span>{new Date(incident.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/admin/incidents`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  {incident.ml_root_cause && (
                    <Alert className="mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Root Cause ML:</strong> {incident.ml_root_cause}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tickets Créés Automatiquement</span>
            <Badge variant="outline">Auto-refresh: 5s</Badge>
          </CardTitle>
          <CardDescription>
            Les tickets sont créés automatiquement pour les alertes critiques via l'edge function "create-ticket"
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recentTickets || recentTickets.length === 0 ? (
            <Alert>
              <AlertDescription>
                Aucun ticket créé pour le moment. Le système créera un ticket automatiquement lors de la détection d'une alerte critique.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{ticket.ticket_title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.ticket_description}</p>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <Badge variant={ticket.status === 'open' ? 'destructive' : 'default'}>
                          {ticket.status}
                        </Badge>
                        <span>•</span>
                        <span>{ticket.integration_type?.toUpperCase() || 'N/A'}</span>
                        <span>•</span>
                        <span>{new Date(ticket.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    {ticket.external_ticket_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(ticket.external_ticket_url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Étapes de Vérification</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside text-sm">
            <li>Créez une alerte critique en cliquant sur le bouton ci-dessus</li>
            <li>Attendez maximum 5 minutes (fréquence du cron job proactive-incident-detector)</li>
            <li>Vérifiez qu'un incident apparaît dans la section "Incidents Récents"</li>
            <li>Vérifiez qu'un ticket est créé dans la section "Tickets Créés"</li>
            <li>Consultez le Dashboard Unifié pour voir les métriques à jour</li>
          </ol>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/admin/unified'}>
              Dashboard Unifié
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/incidents'}>
              Tous les Incidents
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/tickets/integrations'}>
              Configuration Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertTesterPage;
