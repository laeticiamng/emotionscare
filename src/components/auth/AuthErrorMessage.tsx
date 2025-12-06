
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, HelpCircle, Info } from 'lucide-react';
import { AuthErrorType } from '@/lib/auth/authErrorService';
import { cn } from '@/lib/utils';

interface AuthErrorMessageProps {
  type: AuthErrorType;
  message: string;
  recommendation?: string;
  className?: string;
}

const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({
  type,
  message,
  recommendation,
  className
}) => {
  // Déterminer l'icône en fonction du type d'erreur
  const getIcon = () => {
    switch (type) {
      case 'credentials':
      case 'validation':
      case 'email':
        return <AlertCircle size={18} />;
      case 'connection':
      case 'server':
        return <Info size={18} />;
      case 'account':
      case 'unknown':
      default:
        return <HelpCircle size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-3 rounded-md bg-destructive/10 text-destructive",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-grow">
          <p className="font-medium text-sm">{message}</p>
          {recommendation && (
            <p className="text-xs mt-1 text-destructive/80">{recommendation}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuthErrorMessage;
