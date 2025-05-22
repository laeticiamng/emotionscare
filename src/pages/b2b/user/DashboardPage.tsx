
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Bienvenue, {user?.name || 'Collaborateur'}
        </h1>
        <p className="text-muted-foreground">
          Votre espace collaborateur de bien-être émotionnel.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <QuickAccessMenu />
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord d'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualisez les indicateurs de bien-être de votre équipe.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Prochaines sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consultez vos prochaines sessions de coaching et d'activités.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
