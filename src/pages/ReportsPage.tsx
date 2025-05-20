
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LineChart className="h-8 w-8 text-primary" />
              Rapports & Analyses
            </h1>
            <p className="text-muted-foreground mt-1">
              Accédez à vos rapports et analyses détaillés sur votre parcours émotionnel
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/reports-dashboard')} 
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            Voir le dashboard complet
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Rapports hebdomadaires</CardTitle>
                <CardDescription>Suivi hebdomadaire de votre bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Consultez un résumé de votre semaine avec des indicateurs clés sur votre humeur, votre progression et vos activités.
                </p>
                <Button variant="outline" className="w-full mt-4">
                  Voir les rapports hebdomadaires
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Rapports mensuels</CardTitle>
                <CardDescription>Analyse approfondie mensuelle</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Obtenez une vue d'ensemble mensuelle de votre parcours émotionnel avec des tendances, des recommandations et des insights personnalisés.
                </p>
                <Button variant="outline" className="w-full mt-4">
                  Voir les rapports mensuels
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full bg-primary/5">
              <CardHeader>
                <CardTitle>Dashboard premium</CardTitle>
                <CardDescription>Expérience immersive et interactive</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Découvrez notre nouveau dashboard interactif avec visualisations avancées, rapports personnalisés et chronologie de votre parcours.
                </p>
                <Button className="w-full mt-4" onClick={() => navigate('/reports-dashboard')}>
                  Explorer le dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
