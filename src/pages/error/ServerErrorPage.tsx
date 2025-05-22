
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Shell hideNav hideFooter>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-destructive/10 p-5 rounded-full">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Erreur serveur
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Désolé, une erreur s'est produite sur le serveur. Notre équipe technique a été notifiée et travaille à résoudre le problème.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir la page
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
              size="lg"
            >
              <Home className="h-4 w-4" />
              Page d'accueil
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Code d'erreur: <span className="font-mono">500</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Si le problème persiste, veuillez contacter notre
              <Button variant="link" className="px-1 py-0 h-auto" onClick={() => navigate('/support')}>
                équipe de support
              </Button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ServerErrorPage;
