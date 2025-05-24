
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Scan, Brain, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Scanner Émotionnel",
      description: "Analysez votre état émotionnel",
      icon: <Scan className="h-8 w-8 text-blue-500" />,
      path: "/b2b/user/scan",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Coach IA",
      description: "Votre accompagnateur professionnel",
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      path: "/b2b/user/coach",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Musicothérapie",
      description: "Musique pour votre bien-être au travail",
      icon: <Music className="h-8 w-8 text-green-500" />,
      path: "/b2b/user/music",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tableau de Bord Utilisateur B2B
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Votre espace de bien-être professionnel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {modules.map((module, index) => (
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
                      onClick={() => navigate(module.path)}
                      className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90`}
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
