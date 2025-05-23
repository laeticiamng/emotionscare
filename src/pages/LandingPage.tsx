
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap,
  Brain,
  Music,
  Mic
} from 'lucide-react';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();

  const handleGetStarted = () => {
    if (isAuthenticated && userMode) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/choose-mode');
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Analyse d'émotions IA",
      description: "Analysez vos émotions par texte, audio ou emojis avec l'IA avancée",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Music,
      title: "Génération musicale",
      description: "Créez de la musique personnalisée basée sur votre état émotionnel",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Mic,
      title: "Reconnaissance vocale",
      description: "Parlez et laissez l'IA analyser vos émotions vocales",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Users,
      title: "Social & Collaboration",
      description: "Partagez et connectez-vous avec votre communauté",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  const userTypes = [
    {
      icon: Heart,
      title: "Particulier",
      description: "Accès personnel aux outils de bien-être émotionnel",
      path: "/b2c/login",
      color: "border-blue-200 hover:border-blue-400"
    },
    {
      icon: Users,
      title: "Collaborateur",
      description: "Outils de bien-être en entreprise",
      path: "/b2b/user/login",
      color: "border-green-200 hover:border-green-400"
    },
    {
      icon: Building2,
      title: "Administrateur",
      description: "Gestion et analytics pour votre organisation",
      path: "/b2b/admin/login",
      color: "border-purple-200 hover:border-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EmotionsCare</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Badge variant="outline">
                  {user?.email}
                </Badge>
                <Button onClick={handleGetStarted}>
                  Tableau de bord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/choose-mode')}>
                  Se connecter
                </Button>
                <Button onClick={handleGetStarted}>
                  Commencer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Votre bien-être émotionnel
            <span className="text-primary block">avec l'IA</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Analysez, comprenez et améliorez votre état émotionnel grâce à l'intelligence artificielle. 
            Pour les particuliers et les entreprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
              <Building2 className="mr-2 h-5 w-5" />
              Solution entreprise
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités avancées</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des outils puissants alimentés par l'IA pour comprendre et améliorer votre bien-être
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* User Types Section */}
      <section className="container px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Choisissez votre accès</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des solutions adaptées à vos besoins, que vous soyez particulier ou professionnel
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full cursor-pointer transition-all hover:shadow-lg border-2 ${type.color}`}
                    onClick={() => navigate(type.path)}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <type.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    {type.description}
                  </CardDescription>
                  <Button className="w-full" variant="outline">
                    Accéder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-primary/5 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui améliorent leur bien-être émotionnel 
            avec EmotionsCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              <Zap className="mr-2 h-5 w-5" />
              Commencer maintenant
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
              <Shield className="mr-2 h-5 w-5" />
              Solution entreprise
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold">EmotionsCare</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                Paramètres
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                Profil
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/billing')}>
                Facturation
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
