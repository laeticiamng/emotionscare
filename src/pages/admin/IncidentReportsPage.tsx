import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';
import { AlertTriangle } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { downloadExcel, generatePrintablePDF } from '@/lib/exportUtils';
import {
  IncidentCard,
  IncidentDetailDialog,
  IncidentStats,
  IncidentFilters,
  Incident,
  ExportFormat
} from '@/components/admin/incident-reports';

const IncidentReportsPage: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);

  // Fetch incident reports
  const { data: incidents, isLoading } = useQuery<Incident[]>({
    queryKey: ['incident-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data as Incident[];
    },
    refetchInterval: 30000,
  });

  // Filter incidents based on selected filters
  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];

    return incidents.filter(incident => {
      const severityMatch = !selectedSeverity || incident.severity === selectedSeverity;
      const statusMatch = !selectedStatus || incident.status === selectedStatus;
      return severityMatch && statusMatch;
    });
  }, [incidents, selectedSeverity, selectedStatus]);

  const handleExport = async (incident: Incident, exportFormat: ExportFormat) => {
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
        toast.success('Rapport Excel téléchargé avec succès');
      } else {
        generatePrintablePDF({
          title: `Rapport d'Incident ${incident.incident_id}`,
          subtitle: incident.title,
          data: exportData,
          mlRecommendations: recommendations
        });
        toast.success('PDF généré avec succès');
      }
    } catch (error) {
      logger.error('Export error:', error, 'PAGE');
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de l'export: ${errorMessage}`, {
        description: 'Veuillez réessayer ou contacter le support si le problème persiste.'
      });
      throw error; // Re-throw to let the component handle loading state
    }
  };

  const openIncidentDetail = (incident: Incident) => {
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
      <IncidentStats incidents={incidents} />

      {/* Filters */}
      <IncidentFilters
        incidents={incidents}
        selectedSeverity={selectedSeverity}
        selectedStatus={selectedStatus}
        onSeverityChange={setSelectedSeverity}
        onStatusChange={setSelectedStatus}
      />

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Incidents</CardTitle>
          <CardDescription>
            Cliquez sur un incident pour voir les détails complets
            {(selectedSeverity || selectedStatus) && (
              <span className="ml-2 text-primary">
                ({filteredIncidents.length} incident{filteredIncidents.length > 1 ? 's' : ''} filtré{filteredIncidents.length > 1 ? 's' : ''})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onExport={handleExport}
                onClick={openIncidentDetail}
              />
            ))}
            {filteredIncidents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {incidents && incidents.length > 0
                    ? 'Aucun incident ne correspond aux filtres sélectionnés'
                    : 'Aucun incident enregistré'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <IncidentDetailDialog
        incident={selectedIncident}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onExport={handleExport}
      />
    </div>
  );
};

export default IncidentReportsPage;
