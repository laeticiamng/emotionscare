
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Tableau de bord administrateur
        </h1>
        <p className="text-muted-foreground">
          Gérez le bien-être de vos équipes et accédez aux analyses détaillées.
        </p>
      </motion.div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="team">Équipes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Utilisateurs actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">+2% par rapport au mois précédent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Score de bien-être</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">72/100</p>
                <p className="text-xs text-muted-foreground">+5 points par rapport au mois précédent</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sessions prévues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports détaillés</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Les graphiques d'analyse seront affichés ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gérez les membres de votre équipe et leurs accès.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suivez les alertes et les indicateurs nécessitant votre attention.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Accédez rapidement aux actions administratives fréquentes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
