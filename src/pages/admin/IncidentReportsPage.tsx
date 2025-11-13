import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Download,
  TrendingUp,
  Brain
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { downloadExcel, generatePrintablePDF } from '@/lib/exportUtils';

const IncidentReportsPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch incident reports
  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incident-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'outline';
    }
  };

  const handleExport = async (incident: any, exportFormat: 'excel' | 'pdf') => {
    try {
      const exportData = [{
        'ID Incident': incident.incident_id,
        'Titre': incident.title,
        'Sévérité': incident.severity,
        'Statut': incident.status,
        'Début': formatDate(new Date(incident.started_at), 'PPpp', { locale: fr }),
        'Résolu': incident.resolved_at ? formatDate(new Date(incident.resolved_at), 'PPpp', { locale: fr }) : 'En cours',
        'Systèmes Affectés': incident.affected_systems?.join(', ') || 'N/A',
        'Downtime (min)': incident.downtime_minutes || 'N/A',
        'Utilisateurs Affectés': incident.users_affected || 'N/A',
        'Coût Impact (€)': incident.business_impact_cost || 'N/A',
        'Root Cause': incident.root_cause_analysis || 'En analyse',
        'Confiance ML (%)': incident.root_cause_confidence || 'N/A'
      }];

      const recommendations = [
        ...(incident.corrective_actions || []).map((a: string) => `Action corrective: ${a}`),
        ...(incident.preventive_measures || []).map((m: string) => `Mesure préventive: ${m}`),
        ...(incident.lessons_learned || []).map((l: string) => `Leçon apprise: ${l}`)
      ];

      if (exportFormat === 'excel') {
        downloadExcel(
          {
            title: `Rapport d'Incident ${incident.incident_id}`,
            subtitle: incident.title,
            data: exportData,
            mlRecommendations: recommendations
          },
          `incident-${incident.incident_id}.xlsx`
        );
        toast.success('Rapport Excel téléchargé');
      } else {
        generatePrintablePDF({
          title: `Rapport d'Incident ${incident.incident_id}`,
          subtitle: incident.title,
          data: exportData,
          mlRecommendations: recommendations
        });
        toast.success('PDF généré');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const openIncidentDetail = (incident: any) => {
    setSelectedIncident(incident);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapports d'Incidents</h1>
        <p className="text-muted-foreground mt-1">Incidents avec analyse ML automatisée</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ouverts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {incidents?.filter(i => i.status === 'open').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En Investigation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {incidents?.filter(i => i.status === 'investigating').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Résolus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {incidents?.filter(i => i.status === 'resolved' || i.status === 'closed').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Incidents</CardTitle>
          <CardDescription>Cliquez sur un incident pour voir les détails complets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents?.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => openIncidentDetail(incident)}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    <span className="font-mono text-sm text-muted-foreground">
                      {incident.incident_id}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(new Date(incident.started_at), 'PPpp', { locale: fr })}
                  </p>
                  {incident.root_cause_confidence && (
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        Confiance ML: {incident.root_cause_confidence}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(incident, 'excel');
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(incident, 'pdf');
                    }}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!incidents || incidents.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun incident enregistré</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {selectedIncident.incident_id} - {selectedIncident.title}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="analysis">Analyse ML</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="postmortem">Post-Mortem</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Sévérité</label>
                      <Badge variant={getSeverityColor(selectedIncident.severity)} className="mt-1">
                        {selectedIncident.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Statut</label>
                      <Badge variant={getStatusColor(selectedIncident.status)} className="mt-1">
                        {selectedIncident.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Début</label>
                      <p className="text-sm mt-1">
                        {formatDate(new Date(selectedIncident.started_at), 'PPpp', { locale: fr })}
                      </p>
                    </div>
                    {selectedIncident.resolved_at && (
                      <div>
                        <label className="text-sm font-medium">Résolu</label>
                        <p className="text-sm mt-1">
                          {formatDate(new Date(selectedIncident.resolved_at), 'PPpp', { locale: fr })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Systèmes Affectés</label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {selectedIncident.affected_systems?.map((sys: string) => (
                        <Badge key={sys} variant="outline">{sys}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description de l'Impact</label>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {selectedIncident.impact_description || 'Non spécifié'}
                    </p>
                  </div>

                  {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Timeline</label>
                      <div className="mt-2 space-y-2">
                        {selectedIncident.timeline.map((event: any, idx: number) => (
                          <div key={idx} className="flex gap-3 text-sm">
                            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="font-medium">{event.event}</div>
                              <div className="text-muted-foreground">{event.description}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(new Date(event.timestamp), 'PPpp', { locale: fr })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Root Cause Analysis
                      {selectedIncident.root_cause_confidence && (
                        <Badge variant="outline">
                          Confiance: {selectedIncident.root_cause_confidence}%
                        </Badge>
                      )}
                    </label>
                    <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">
                      {selectedIncident.root_cause_analysis || 'Analyse en cours...'}
                    </p>
                  </div>

                  {selectedIncident.contributing_factors && selectedIncident.contributing_factors.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Facteurs Contributeurs</label>
                      <ul className="mt-2 space-y-1">
                        {selectedIncident.contributing_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  {selectedIncident.corrective_actions && selectedIncident.corrective_actions.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Actions Correctives</label>
                      <ul className="mt-2 space-y-2">
                        {selectedIncident.corrective_actions.map((action: string, idx: number) => (
                          <li key={idx} className="text-sm flex gap-2 items-start">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedIncident.preventive_measures && selectedIncident.preventive_measures.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Mesures Préventives</label>
                      <ul className="mt-2 space-y-2">
                        {selectedIncident.preventive_measures.map((measure: string, idx: number) => (
                          <li key={idx} className="text-sm flex gap-2 items-start">
                            <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedIncident.lessons_learned && selectedIncident.lessons_learned.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Leçons Apprises</label>
                      <ul className="mt-2 space-y-2">
                        {selectedIncident.lessons_learned.map((lesson: string, idx: number) => (
                          <li key={idx} className="text-sm flex gap-2 items-start">
                            <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="postmortem">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {selectedIncident.post_mortem_template || 'Template en génération...'}
                    </pre>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => handleExport(selectedIncident, 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Exporter PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleExport(selectedIncident, 'excel')}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter Excel
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentReportsPage;
