
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
import { Music, Heart, FileText, Users, Calendar, BarChart2, ArrowRight, Brain, User, Shield } from 'lucide-react';

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

  // Testimonials data
  const testimonials = [
    {
      name: "Marie L.",
      title: "Utilisatrice depuis 6 mois",
      content: "EmotionsCare m'a aidée à mieux comprendre mes émotions et à gérer mon anxiété. Je me sens beaucoup plus équilibrée au quotidien.",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      name: "Thomas D.",
      title: "Utilisateur depuis 3 mois",
      content: "La musicothérapie combinée aux exercices de pleine conscience a transformé ma façon de gérer le stress. Un outil indispensable.",
      avatar: "https://i.pravatar.cc/150?img=53"
    },
    {
      name: "Sophie M.",
      title: "Psychologue",
      content: "Je recommande EmotionsCare à mes patients. Les outils sont basés sur des pratiques scientifiquement prouvées et les résultats sont remarquables.",
      avatar: "https://i.pravatar.cc/150?img=44"
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
                <Card className="h-full hover:shadow-md transition-shadow duration-200 group">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className={`rounded-full p-4 mb-4 ${feature.color} transition-all duration-300 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                    <Button variant="outline" className="w-full group">
                      {isAuthenticated ? "Accéder" : "Se connecter pour accéder"}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {!isAuthenticated && <CtaSection />}
      
      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ce que nos utilisateurs disent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare aide nos utilisateurs à améliorer leur bien-être émotionnel au quotidien.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <WelcomeHero
          title="Prêt à prendre soin de votre santé émotionnelle ?"
          subtitle="Notre plateforme combine technologie et psychologie pour vous offrir une expérience personnalisée."
          ctaButtons={[
            {
              label: "Commencer",
              link: isAuthenticated ? "/dashboard" : "/register",
              text: isAuthenticated ? "Aller au tableau de bord" : "Créer un compte",
              icon: true
            },
            {
              label: "En savoir plus",
              link: "/about",
              text: "Découvrir notre approche",
              variant: "outline"
            }
          ]}
          backgroundColor="bg-gradient-to-r from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/20"
          textColor="text-primary-foreground dark:text-foreground"
        />
      </section>
      
      {/* Additional Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir EmotionsCare</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre approche unique combine science, technologie et bienveillance pour vous accompagner au quotidien.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Approche scientifique</h3>
            <p className="text-muted-foreground">
              Nos méthodes sont basées sur des recherches scientifiques en psychologie positive et neurosciences.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personnalisation</h3>
            <p className="text-muted-foreground">
              Une expérience sur mesure qui s'adapte à vos besoins spécifiques et à votre progression.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Confidentialité</h3>
            <p className="text-muted-foreground">
              Protection maximale de vos données personnelles et de votre vie privée.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="px-8">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Accéder à mon espace" : "Commencer gratuitement"}
            </Link>
          </Button>
        </motion.div>
      </section>
    </Shell>
  );
};

export default Index;
