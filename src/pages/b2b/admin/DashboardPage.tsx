
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BarChart, Settings, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Gestion des Utilisateurs",
      description: "Administrez les comptes de votre équipe",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Analytics Équipe",
      description: "Visualisez les données de bien-être",
      icon: <BarChart className="h-8 w-8 text-purple-500" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Rapports",
      description: "Générez des rapports détaillés",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Activité Temps Réel",
      description: "Surveillez l'activité en direct",
      icon: <Activity className="h-8 w-8 text-orange-500" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Configuration",
      description: "Paramètres de l'organisation",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      color: "from-gray-500 to-slate-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tableau de Bord Administrateur RH
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Gérez le bien-être de votre équipe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {adminModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                      {module.icon}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90`}
                      disabled
                    >
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Fonctionnalités en Développement</CardTitle>
                <CardDescription>
                  L'interface administrateur complète sera bientôt disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Vous pourrez bientôt gérer tous les aspects du bien-être de votre équipe 
                  depuis cette interface centralisée.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
