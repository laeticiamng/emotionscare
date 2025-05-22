
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import DashboardHero from '@/components/dashboard/DashboardHero';
import QuickNavGrid from '@/components/dashboard/QuickNavGrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Données fictives pour le graphique
const emotionalData = [
  { day: 'Lun', score: 70 },
  { day: 'Mar', score: 65 },
  { day: 'Mer', score: 72 },
  { day: 'Jeu', score: 68 },
  { day: 'Ven', score: 75 },
  { day: 'Sam', score: 82 },
  { day: 'Dim', score: 78 }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('semaine');
  
  const mockUser = {
    name: user?.name || 'Utilisateur',
    avatar: user?.avatar || undefined
  };

  return (
    <Shell>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <DashboardHero 
            user={mockUser}
            points={1250}
            level="Explorateur"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Évolution émotionnelle</CardTitle>
              <Tabs defaultValue="semaine" onValueChange={setTimeRange} className="h-8">
                <TabsList>
                  <TabsTrigger value="semaine" className="text-xs px-2">Semaine</TabsTrigger>
                  <TabsTrigger value="mois" className="text-xs px-2">Mois</TabsTrigger>
                  <TabsTrigger value="annee" className="text-xs px-2">Année</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={emotionalData}
                    margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" tickMargin={10} />
                    <YAxis domain={[0, 100]} tickMargin={10} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="Score émotionnel" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Score moyen</span>
                  <span className="font-medium text-lg">72/100</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Scans cette semaine</span>
                  <span className="font-medium text-lg">5</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Entrées de journal</span>
                  <span className="font-medium text-lg">12</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sessions de relaxation</span>
                  <span className="font-medium text-lg">8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Accès rapides</h2>
          <QuickNavGrid />
        </motion.div>
        
        <TabsContent value="all">
          {/* Contenu complet du tableau de bord ici */}
        </TabsContent>
      </div>
    </Shell>
  );
};

export default UserDashboard;
