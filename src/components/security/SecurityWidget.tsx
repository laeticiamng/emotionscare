import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

export interface Incident {
  id: string;
  message: string;
  date: string;
}

type SecurityWidgetProps = {
  incidents?: Incident[];
};

const getStatusBadge = (incidents: Incident[]) => {
  if (incidents.length === 0) {
    return {
      icon: ShieldCheck,
      label: 'Système nominal',
      className: 'text-emerald-600',
    };
  }

  return {
    icon: ShieldAlert,
    label: `${incidents.length} incident${incidents.length > 1 ? 's' : ''} récent${incidents.length > 1 ? 's' : ''}`,
    className: 'text-amber-600',
  };
};

/**
 * Widget sécurité synthétique (état + dernier incident).
 */
const SecurityWidget: React.FC<SecurityWidgetProps> = ({ incidents = [] }) => {
  const lastIncident = incidents[0];
  const status = getStatusBadge(incidents);
  const StatusIcon = status.icon;

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <StatusIcon className={`w-4 h-4 ${status.className}`} />
          <span className="text-muted-foreground">{status.label}</span>
        </div>

        {lastIncident ? (
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <div>
              <p className="font-medium">Dernier incident</p>
              <p className="text-muted-foreground">{lastIncident.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{lastIncident.date}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun incident récent détecté.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityWidget;
