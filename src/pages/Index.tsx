
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import HeroSection from '@/components/home/HeroSection';
import WelcomeHero from '@/components/home/WelcomeHero';
import CtaSection from '@/components/home/CtaSection';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Heart, FileText, Users, Calendar, BarChart2 } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Feature cards data
  const features = [
    {
      title: "Tableau de bord",
      description: "Visualisez vos données émotionnelles et suivez votre progression.",
      icon: <BarChart2 className="h-12 w-12 text-primary" />,
      path: "/dashboard",
      color: "bg-primary/10"
    },
    {
      title: "Journal émotionnel",
      description: "Enregistrez vos émotions et réflexions quotidiennes.",
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      path: "/journal",
      color: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Musicothérapie",
      description: "Découvrez des playlists adaptées à vos émotions.",
      icon: <Music className="h-12 w-12 text-purple-500" />,
      path: "/music",
      color: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel actuel.",
      icon: <Heart className="h-12 w-12 text-red-500" />,
      path: "/scan",
      color: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Communauté",
      description: "Rejoignez notre communauté bienveillante.",
      icon: <Users className="h-12 w-12 text-green-500" />,
      path: "/social",
      color: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Sessions",
      description: "Planifiez et suivez vos sessions thérapeutiques.",
      icon: <Calendar className="h-12 w-12 text-amber-500" />,
      path: "/sessions",
      color: "bg-amber-100 dark:bg-amber-900/20"
    }
  ];

  return (
    <Shell>
      <HeroSection />

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Découvrez nos fonctionnalités</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            EmotionsCare vous offre de nombreux outils pour améliorer votre bien-être émotionnel
            et développer votre intelligence émotionnelle au quotidien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={isAuthenticated ? feature.path : "/login"} className="block h-full">
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className={`rounded-full p-4 mb-4 ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                    <Button variant="outline" className="w-full">
                      {isAuthenticated ? "Accéder" : "Se connecter pour accéder"}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {!isAuthenticated && <CtaSection />}

      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <WelcomeHero
          title="Prêt à prendre soin de votre santé émotionnelle ?"
          subtitle="Notre plateforme combine technologie et psychologie pour vous offrir une expérience personnalisée."
          ctaButtons={[
            {
              label: "Commencer",
              link: isAuthenticated ? "/dashboard" : "/register",
              text: isAuthenticated ? "Aller au tableau de bord" : "Créer un compte"
            },
            {
              label: "En savoir plus",
              link: "/about",
              text: "Découvrir notre approche"
            }
          ]}
        />
      </section>
    </Shell>
  );
};

export default Index;
