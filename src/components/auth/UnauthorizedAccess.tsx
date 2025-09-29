
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UnauthorizedAccessProps {
  message?: string;
  redirectPath?: string;
  redirectDelay?: number;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  message = "Vous n'avez pas accès à cette page",
  redirectPath = '/',
  redirectDelay = 5000
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show toast notification
    toast({
      title: "Accès non autorisé",
      description: message,
      variant: "destructive",
    });
    
    // Auto-redirect after delay
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, redirectDelay);
    
    return () => clearTimeout(timer);
  }, [navigate, redirectPath, redirectDelay, message, toast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="mb-4 inline-flex"
            >
              <AlertTriangle className="h-16 w-16 text-amber-500" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2">Accès non autorisé</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={() => navigate(-1)} 
                variant="outline" 
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="bg-muted px-6 py-3 text-sm text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Redirection automatique dans {Math.ceil(redirectDelay / 1000)} secondes...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedAccess;
