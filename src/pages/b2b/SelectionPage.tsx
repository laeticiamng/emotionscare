
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Utilisateur",
      description: "Accédez à votre espace personnel dans l'entreprise",
      icon: <Users className="h-12 w-12 text-blue-500" />,
      path: "/b2b/user/login",
      features: ["Tableau de bord personnel", "Scan émotionnel", "Coach IA", "Musique thérapeutique"]
    },
    {
      title: "Administrateur RH",
      description: "Gérez le bien-être de votre équipe",
      icon: <Shield className="h-12 w-12 text-green-500" />,
      path: "/b2b/admin/login",
      features: ["Analytics équipe", "Gestion utilisateurs", "Rapports détaillés", "Configuration"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Accès Entreprise
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choisissez votre type d'accès pour continuer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                    {option.icon}
                  </div>
                  <CardTitle className="text-2xl">{option.title}</CardTitle>
                  <CardDescription className="text-base">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => navigate(option.path)}
                    className="w-full group-hover:bg-primary/90"
                  >
                    Accéder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
