
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Page non trouvée</h2>
            <p className="text-muted-foreground mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/')}
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Page précédente
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
