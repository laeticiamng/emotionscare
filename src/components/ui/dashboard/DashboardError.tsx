import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DashboardErrorProps {
  message?: string;
  onRetry?: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({
  message = "Impossible de charger votre espace, veuillez réessayer.",
  onRetry
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">Oups !</h3>
      
      <p className="text-muted-foreground mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
          size="lg"
        >
          <span>Réessayer</span>
        </Button>
      )}
      
      <p className="mt-4 text-sm text-muted-foreground">
        Si le problème persiste, n'hésitez pas à contacter notre support.
      </p>
    </motion.div>
  );
};

export default DashboardError;
