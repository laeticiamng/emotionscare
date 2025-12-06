// @ts-nocheck
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface Incident {
  id: string;
  message: string;
  date: string;
}

/**
 * Simple security widget displaying latest incident and status.
 * This is a placeholder for the proactive security module.
 */
const SecurityWidget: React.FC<{ incidents?: Incident[] }> = ({ incidents = [] }) => {
  const lastIncident = incidents[0];

  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
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
