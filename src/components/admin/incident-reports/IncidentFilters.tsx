import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Incident } from './types';

interface IncidentFiltersProps {
  incidents?: Incident[];
  selectedSeverity?: string;
  selectedStatus?: string;
  onSeverityChange: (severity: string | undefined) => void;
  onStatusChange: (status: string | undefined) => void;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  incidents,
  selectedSeverity,
  selectedStatus,
  onSeverityChange,
  onStatusChange,
}) => {
  const severities = ['critical', 'high', 'medium', 'low'];
  const statuses = ['open', 'investigating', 'resolved', 'closed'];

  const getSeverityCount = (severity: string) => {
    return incidents?.filter(i => i.severity === severity).length || 0;
  };

  const getStatusCount = (status: string) => {
    return incidents?.filter(i => i.status === status).length || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
        <CardDescription>Filtrer les incidents par sévérité et statut</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Sévérité</label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSeverity === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onSeverityChange(undefined)}
            >
              Tous ({incidents?.length || 0})
            </Button>
            {severities.map((severity) => (
              <Button
                key={severity}
                variant={selectedSeverity === severity ? "default" : "outline"}
                size="sm"
                onClick={() => onSeverityChange(severity)}
              >
                {severity} ({getSeverityCount(severity)})
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Statut</label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(undefined)}
            >
              Tous ({incidents?.length || 0})
            </Button>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status)}
              >
                {status} ({getStatusCount(status)})
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
