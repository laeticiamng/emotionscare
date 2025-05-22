
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-bold mb-4">Page introuvable</h1>
        
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Page précédente</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
