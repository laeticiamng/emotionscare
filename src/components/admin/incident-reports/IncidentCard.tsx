import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Brain } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Incident, ExportFormat, SeverityVariant, StatusVariant } from './types';

interface IncidentCardProps {
  incident: Incident;
  onExport: (incident: Incident, format: ExportFormat) => Promise<void>;
  onClick: (incident: Incident) => void;
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

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onExport, onClick }) => {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (e: React.MouseEvent, format: ExportFormat) => {
    e.stopPropagation();
    setIsExporting(format);
    try {
      await onExport(incident, format);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => onClick(incident)}
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
          onClick={(e) => handleExport(e, 'excel')}
          disabled={isExporting === 'excel'}
          aria-label="Exporter en Excel"
        >
          {isExporting === 'excel' ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => handleExport(e, 'pdf')}
          disabled={isExporting === 'pdf'}
          aria-label="Exporter en PDF"
        >
          {isExporting === 'pdf' ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
