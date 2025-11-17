import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  TrendingUp,
  Brain
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Incident, ExportFormat, SeverityVariant, StatusVariant } from './types';
import { IncidentTimeline } from './IncidentTimeline';

interface IncidentDetailDialogProps {
  incident: Incident | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (incident: Incident, format: ExportFormat) => Promise<void>;
}

const getSeverityColor = (severity: string): SeverityVariant => {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'warning';
    case 'low': return 'secondary';
    default: return 'outline';
  }
};

const getStatusColor = (status: string): StatusVariant => {
  switch (status) {
    case 'open': return 'destructive';
    case 'investigating': return 'warning';
    case 'resolved': return 'success';
    case 'closed': return 'secondary';
    default: return 'outline';
  }
};

export const IncidentDetailDialog: React.FC<IncidentDetailDialogProps> = ({
  incident,
  isOpen,
  onOpenChange,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!incident) return;

    setIsExporting(format);
    try {
      await onExport(incident, format);
    } finally {
      setIsExporting(null);
    }
  };

  if (!incident) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {incident.incident_id} - {incident.title}
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
                <Badge variant={getSeverityColor(incident.severity)} className="mt-1">
                  {incident.severity}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Statut</label>
                <Badge variant={getStatusColor(incident.status)} className="mt-1">
                  {incident.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Début</label>
                <p className="text-sm mt-1">
                  {formatDate(new Date(incident.started_at), 'PPpp', { locale: fr })}
                </p>
              </div>
              {incident.resolved_at && (
                <div>
                  <label className="text-sm font-medium">Résolu</label>
                  <p className="text-sm mt-1">
                    {formatDate(new Date(incident.resolved_at), 'PPpp', { locale: fr })}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Systèmes Affectés</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {incident.affected_systems?.map((sys) => (
                  <Badge key={sys} variant="outline">{sys}</Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description de l'Impact</label>
              <p className="text-sm mt-1 text-muted-foreground">
                {incident.impact_description || 'Non spécifié'}
              </p>
            </div>

            <IncidentTimeline timeline={incident.timeline} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Root Cause Analysis
                {incident.root_cause_confidence && (
                  <Badge variant="outline">
                    Confiance: {incident.root_cause_confidence}%
                  </Badge>
                )}
              </label>
              <p className="text-sm mt-2 text-muted-foreground whitespace-pre-wrap">
                {incident.root_cause_analysis || 'Analyse en cours...'}
              </p>
            </div>

            {incident.contributing_factors && incident.contributing_factors.length > 0 && (
              <div>
                <label className="text-sm font-medium">Facteurs Contributeurs</label>
                <ul className="mt-2 space-y-1">
                  {incident.contributing_factors.map((factor, idx) => (
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
            {incident.corrective_actions && incident.corrective_actions.length > 0 && (
              <div>
                <label className="text-sm font-medium">Actions Correctives</label>
                <ul className="mt-2 space-y-2">
                  {incident.corrective_actions.map((action, idx) => (
                    <li key={idx} className="text-sm flex gap-2 items-start">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {incident.preventive_measures && incident.preventive_measures.length > 0 && (
              <div>
                <label className="text-sm font-medium">Mesures Préventives</label>
                <ul className="mt-2 space-y-2">
                  {incident.preventive_measures.map((measure, idx) => (
                    <li key={idx} className="text-sm flex gap-2 items-start">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {incident.lessons_learned && incident.lessons_learned.length > 0 && (
              <div>
                <label className="text-sm font-medium">Leçons Apprises</label>
                <ul className="mt-2 space-y-2">
                  {incident.lessons_learned.map((lesson, idx) => (
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
                {incident.post_mortem_template || 'Template en génération...'}
              </pre>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => handleExport('pdf')}
                disabled={isExporting === 'pdf'}
              >
                {isExporting === 'pdf' ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('excel')}
                disabled={isExporting === 'excel'}
              >
                {isExporting === 'excel' ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter Excel
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
