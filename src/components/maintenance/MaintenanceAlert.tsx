// @ts-nocheck

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wrench } from 'lucide-react';

interface MaintenanceAlertProps {
  title?: string;
  message?: string;
  type?: 'warning' | 'info';
}

const MaintenanceAlert: React.FC<MaintenanceAlertProps> = ({
  title = "Fonction en maintenance",
  message = "Cette fonctionnalité est temporairement indisponible. Réessayez dans quelques minutes.",
  type = 'warning'
}) => {
  const Icon = type === 'warning' ? AlertTriangle : Wrench;
  const alertClass = type === 'warning' ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50';
  const textClass = type === 'warning' ? 'text-orange-800' : 'text-blue-800';
  const iconClass = type === 'warning' ? 'text-orange-600' : 'text-blue-600';

  return (
    <Alert className={alertClass}>
      <Icon className={`h-4 w-4 ${iconClass}`} />
      <AlertDescription className={textClass}>
        <strong>{title}</strong><br />
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceAlert;
