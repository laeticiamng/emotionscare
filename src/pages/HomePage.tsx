
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Brain, Users, User, Building2, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      title: "Scan émotionnel",
      description: "Analysez et suivez vos émotions pour une meilleure compréhension de votre bien-être",
      icon: Heart,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      title: "Coaching personnalisé",
      description: "Recevez des conseils adaptés à votre profil émotionnel et vos objectifs",
      icon: Brain,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      title: "Bien-être d'entreprise",
      description: "Solutions complètes pour améliorer le bien-être émotionnel au sein des organisations",
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Prenez soin de votre <span className="text-primary">bien-être émotionnel</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Découvrez des outils innovants pour comprendre, gérer et améliorer votre équilibre émotionnel au quotidien.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/b2c/login')}
              >
                {isAuthenticated ? 'Accéder à mon espace' : 'Commencer maintenant'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={() => navigate('/b2b/selection')}
              >
                Solutions entreprise
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nos solutions pour votre bien-être</h2>
            <p className="mt-4 text-lg text-muted-foreground">Des outils adaptés à vos besoins émotionnels</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className={`${feature.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Users section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Une solution pour chaque besoin</h2>
            <p className="mt-4 text-lg text-muted-foreground">Choisissez l'accès qui vous convient</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50 dark:from-green-950 dark:opacity-25" />
              <CardContent className="p-6 relative">
                <div className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Particuliers</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span>Analyse émotionnelle personnalisée</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span>Journal émotionnel</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span>Contenus adaptatifs</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/b2c/login')}
                >
                  Espace personnel
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 dark:from-blue-950 dark:opacity-25" />
              <CardContent className="p-6 relative">
                <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Collaborateurs</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>Bien-être en environnement professionnel</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>Sessions d'équipe</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <span>Ressources d'entreprise</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/b2b/user/login')}
                >
                  Espace collaborateur
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50 dark:from-purple-950 dark:opacity-25" />
              <CardContent className="p-6 relative">
                <div className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Organisations</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span>Gestion complète des utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span>Analyse des données d'équipe</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                    <span>Configuration avancée</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  Espace administrateur
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre bien-être émotionnel ?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez des milliers d'utilisateurs qui ont transformé leur expérience émotionnelle
            </p>
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/choose-mode')}
            >
              {isAuthenticated ? 'Accéder à mon espace' : 'Choisir mon mode d\'accès'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">EmotionsCare</h3>
              <p className="text-sm text-muted-foreground">Votre partenaire pour un bien-être émotionnel optimal.</p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Solutions</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/b2c/login')}>Particuliers</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/b2b/user/login')}>Collaborateurs</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/b2b/admin/login')}>Entreprises</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Ressources</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/blog')}>Blog</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/support')}>Support</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/faq')}>FAQ</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Légal</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/terms')}>Conditions d'utilisation</Button></li>
                <li><Button variant="link" className="p-0 h-auto" onClick={() => navigate('/privacy')}>Politique de confidentialité</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
