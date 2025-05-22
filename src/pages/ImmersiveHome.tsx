
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  HeartHandshake,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: 'Journal émotionnel',
      description: 'Suivez votre bien-être au quotidien et identifiez les tendances',
      path: '/journal',
      color: 'bg-blue-500/10',
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      title: 'Événements',
      description: 'Découvrez et participez à des activités de bien-être',
      path: '/events',
      color: 'bg-green-500/10',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      title: 'Coach IA',
      description: 'Bénéficiez de conseils personnalisés pour votre bien-être',
      path: '/coach',
      color: 'bg-purple-500/10',
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-rose-500" />,
      title: 'Social Cocoon',
      description: 'Échangez anonymement dans un environnement bienveillant',
      path: '/social-cocoon',
      color: 'bg-rose-500/10',
    },
    {
      icon: <Users className="h-8 w-8 text-amber-500" />,
      title: 'Équipes',
      description: 'Gérez vos équipes et suivez le bien-être collectif',
      path: '/teams',
      color: 'bg-amber-500/10',
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-cyan-500" />,
      title: 'Optimisation',
      description: 'Améliorez le bien-être de vos équipes avec des recommandations ciblées',
      path: '/optimization',
      color: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Prenez soin de votre <span className="text-primary">bien-être émotionnel</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Découvrez notre plateforme complète dédiée à l'amélioration de votre bien-être quotidien et à la gestion de vos émotions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="text-lg"
            >
              Accéder à votre espace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/b2b/selection')}
            >
              Solutions entreprise
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => navigate(feature.path)}
                  >
                    Explorer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Commencez votre parcours de bien-être dès aujourd'hui</h2>
              <p className="mb-6 opacity-90">
                Explorez toutes nos fonctionnalités et découvrez comment elles peuvent vous aider au quotidien.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Aller au tableau de bord
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
