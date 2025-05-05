
import React from 'react';
import { Mic, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type StatusType = 'idle' | 'recording' | 'processing' | 'success' | 'error';

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const getIcon = () => {
    switch (status) {
      case 'recording':
        return <Mic className="h-5 w-5 text-red-500 animate-pulse" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Mic className="h-5 w-5 text-gray-400" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'recording':
        return 'Enregistrement en cours...';
      case 'processing':
        return 'Traitement audio...';
      case 'success':
        return 'Analyse complétée';
      case 'error':
        return 'Erreur de traitement';
      default:
        return 'Prêt à enregistrer';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {getIcon()}
      <span className="ml-2 text-sm">{getLabel()}</span>
    </div>
  );
};

export default StatusIndicator;
