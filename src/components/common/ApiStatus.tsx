import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

export interface ApiStatusProps {
  status: 'online' | 'offline' | 'loading' | 'error';
  message?: string;
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ 
  status, 
  message = '', 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          variant: 'default' as const,
          color: 'text-green-600',
          text: message || 'Service en ligne'
        };
      case 'offline':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          color: 'text-red-600',
          text: message || 'Service hors ligne'
        };
      case 'loading':
        return {
          icon: Clock,
          variant: 'secondary' as const,
          color: 'text-orange-600',
          text: message || 'Vérification en cours...'
        };
      case 'error':
        return {
          icon: AlertCircle,
          variant: 'destructive' as const,
          color: 'text-red-600',
          text: message || 'Erreur de service'
        };
      default:
        return {
          icon: AlertCircle,
          variant: 'secondary' as const,
          color: 'text-gray-600',
          text: 'Statut inconnu'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-2 ${className}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span>{config.text}</span>
    </Badge>
  );
};

export default ApiStatus;