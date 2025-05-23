
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Glasses, MessageSquare, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';

const B2CDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Bienvenue, {user?.name || 'Utilisateur'}
        </h1>
        <p className="text-muted-foreground">
          Voici votre tableau de bord personnel pour suivre et améliorer votre bien-être émotionnel.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCard
            title="Score émotionnel"
            value="75/100"
            description="En progression (+5%)"
            trend="up"
            icon={<Heart className="h-4 w-4" />}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsCard
            title="Séances VR"
            value="3"
            description="Cette semaine"
            icon={<Glasses className="h-4 w-4" />}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatsCard
            title="Entrées journal"
            value="12"
            description="Ce mois-ci"
            icon={<BookOpen className="h-4 w-4" />}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatsCard
            title="Sessions de coaching"
            value="2"
            description="Programmées"
            icon={<MessageSquare className="h-4 w-4" />}
          />
        </motion.div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => navigate('/b2c/scan')}
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Heart className="h-6 w-6 mb-1" />
                  <span>Scan émotionnel</span>
                </Button>
                <Button 
                  onClick={() => navigate('/b2c/journal')}
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BookOpen className="h-6 w-6 mb-1" />
                  <span>Journal</span>
                </Button>
                <Button 
                  onClick={() => navigate('/b2c/vr')}
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Glasses className="h-6 w-6 mb-1" />
                  <span>Réalité virtuelle</span>
                </Button>
                <Button 
                  onClick={() => navigate('/b2c/coach')}
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <MessageSquare className="h-6 w-6 mb-1" />
                  <span>Coach virtuel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Évolution récente</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                Le graphique de votre évolution émotionnelle sera affiché ici
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboard;
