
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { Clock, Construction, ArrowLeft } from 'lucide-react';

const NotImplementedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="container mx-auto py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="p-5 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Construction className="h-16 w-16 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Fonctionnalité à venir</h1>
          
          <p className="text-muted-foreground text-lg mb-8">
            Cette fonctionnalité est actuellement en cours de développement et sera disponible prochainement.
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-12">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">En construction</span>
          </div>
          
          <div className="space-x-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="px-6"
            >
              Accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default NotImplementedPage;
