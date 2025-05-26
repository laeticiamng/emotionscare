
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else {
      navigate('/b2b/selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center mb-6"
          >
            <Heart className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </motion.div>
          <p className="text-xl text-muted-foreground mb-8">
            Votre plateforme de bien-être émotionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-16 w-16 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Particulier</CardTitle>
                <CardDescription className="text-base">
                  Prenez soin de votre bien-être émotionnel personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Suivi émotionnel personnel
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Coach IA personnalisé
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Thérapie musicale
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Journal émotionnel
                  </li>
                </ul>
                <Button 
                  onClick={() => handleModeSelection('b2c')}
                  className="w-full group-hover:bg-primary/90"
                >
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Entreprise</CardTitle>
                <CardDescription className="text-base">
                  Améliorez le bien-être de vos équipes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Dashboard RH complet
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Analytics équipe
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Gestion des collaborateurs
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Rapports de bien-être
                  </li>
                </ul>
                <Button 
                  onClick={() => handleModeSelection('b2b')}
                  className="w-full group-hover:bg-primary/90"
                >
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
