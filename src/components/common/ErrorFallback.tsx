import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from '@/components/ui/premium-card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  errorInfo?: React.ErrorInfo;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary,
  errorInfo 
}) => {
  const handleReportError = () => {
    // In production, send error to monitoring service
    console.error('Error reported:', { error, errorInfo });
    
    // Example: Send to Sentry, LogRocket, etc.
    // errorReportingService.report({ error, errorInfo });
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-destructive/5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <PremiumCard variant="elevated" className="text-center">
          <PremiumCardHeader className="pb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </motion.div>
            
            <PremiumCardTitle className="text-destructive">
              Oops ! Une erreur s'est produite
            </PremiumCardTitle>
          </PremiumCardHeader>
          
          <PremiumCardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Nous sommes désolés, mais quelque chose s'est mal passé. 
              L'équipe technique a été automatiquement notifiée.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  Détails techniques
                </summary>
                <pre className="text-xs text-destructive mt-2 p-2 bg-destructive/5 rounded whitespace-pre-wrap">
                  {error.message}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col space-y-2">
              <EnhancedButton
                onClick={resetErrorBoundary}
                variant="default"
                icon={<RefreshCw className="w-4 h-4" />}
                className="w-full"
              >
                Réessayer
              </EnhancedButton>
              
              <EnhancedButton
                onClick={goHome}
                variant="outline"
                icon={<Home className="w-4 h-4" />}
                className="w-full"
              >
                Retour à l'accueil
              </EnhancedButton>
              
              <EnhancedButton
                onClick={handleReportError}
                variant="ghost"
                icon={<Bug className="w-4 h-4" />}
                className="w-full text-xs"
                size="sm"
              >
                Signaler le problème
              </EnhancedButton>
            </div>
          </PremiumCardContent>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default ErrorFallback;