
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Shell from '@/Shell';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell hideNav hideFooter>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-4">Accès interdit</h2>
            <p className="text-muted-foreground mb-8">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home size={16} />
                Page d'accueil
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ForbiddenPage;
