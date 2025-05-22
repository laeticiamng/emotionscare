
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Heart, HeartPulse, Music, Shield, Sparkles, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      toast.error("Vous devez vous connecter pour accéder au tableau de bord");
      navigate('/login');
    }
  };

  return (
    <Shell>
      <div className="container px-4 py-8 mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Prenez soin de votre bien-être émotionnel
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              EmotionsCare vous accompagne dans votre parcours vers l'équilibre émotionnel avec des outils innovants et personnalisés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDashboardClick} size="lg" className="group">
                <span>Commencer maintenant</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30 rounded-3xl px-8 my-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nos fonctionnalités principales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare peut vous aider à gérer vos émotions et améliorer votre bien-être quotidien.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Music />}
              title="Thérapie musicale"
              description="Des compositions musicales spécialement conçues pour influencer positivement vos émotions."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Book />}
              title="Journal émotionnel"
              description="Suivez et analysez vos émotions grâce à un journal interactif avec des insights personnalisés."
              delay={0.2}
            />
            <FeatureCard 
              icon={<HeartPulse />}
              title="Suivi du bien-être"
              description="Visualisez l'évolution de votre bien-être émotionnel avec des analyses détaillées."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Shield />}
              title="Sécurité et confidentialité"
              description="Vos données émotionnelles sont protégées avec les plus hauts standards de sécurité."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Users />}
              title="Social Cocoon"
              description="Rejoignez une communauté bienveillante et partagez vos expériences en toute sécurité."
              delay={0.5}
            />
            <FeatureCard 
              icon={<Sparkles />}
              title="Coaching personnalisé"
              description="Recevez des recommandations adaptées à vos besoins émotionnels spécifiques."
              delay={0.6}
            />
          </div>
        </section>
        
        {/* Connection Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-xl p-8 mb-12 border-2 border-blue-200/50 dark:border-blue-800/30"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-8 text-center text-blue-600 dark:text-blue-400">
            Choisissez votre accès
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg transition-all duration-300 border-4 border-blue-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Particulier</h3>
              <p className="mb-6 text-lg text-muted-foreground">Accédez à votre espace personnel</p>
              <Button 
                onClick={() => navigate('/login')}
                size="lg" 
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
              >
                Espace Personnel
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg transition-all duration-300 border-4 border-blue-300 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-500 dark:text-blue-300">Entreprise</h3>
              <p className="mb-6 text-lg text-muted-foreground">Solutions pour votre organisation</p>
              <Button 
                onClick={() => navigate('/coming-soon')}
                variant="secondary"
                size="lg" 
                className="w-full text-lg py-6 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
              >
                Espace Entreprise
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare transforme le quotidien de nos utilisateurs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="EmotionsCare a changé ma façon de gérer mon anxiété. La thérapie musicale est particulièrement efficace."
              author="Marie L."
              role="Utilisatrice depuis 6 mois"
              delay={0.1}
            />
            <TestimonialCard 
              quote="Le journal émotionnel m'a aidé à identifier mes déclencheurs de stress et à développer de meilleures stratégies de gestion."
              author="Thomas D."
              role="Utilisateur depuis 1 an"
              delay={0.2}
            />
            <TestimonialCard 
              quote="La communauté Social Cocoon est incroyablement bienveillante et m'a permis de me sentir moins seule dans mes défis émotionnels."
              author="Sophie M."
              role="Utilisatrice depuis 3 mois"
              delay={0.3}
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-3xl my-16 px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Prêt à prendre soin de votre bien-être émotionnel ?</h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez des milliers d'utilisateurs qui améliorent leur équilibre émotionnel chaque jour avec EmotionsCare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/login')} size="lg">
                S'inscrire gratuitement
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/coming-soon')}>
                Explorer les plans Premium
              </Button>
            </div>
          </div>
        </section>

        {/* Test accounts section - For presentation purposes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md border border-blue-100 dark:border-blue-800/30"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-blue-700 dark:text-blue-300">Comptes de démonstration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Particulier</h3>
              <p className="text-gray-500 dark:text-gray-400">utilisateur@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Admin</h3>
              <p className="text-gray-500 dark:text-gray-400">admin@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Collaborateur</h3>
              <p className="text-gray-500 dark:text-gray-400">collaborateur@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ces comptes sont préchargés pour la démonstration. Utilisez-les pour explorer les différentes interfaces de l'application.
            </p>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

// Composant de carte de fonctionnalité
const FeatureCard = ({ 
  icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

// Composant de témoignage
const TestimonialCard = ({ 
  quote, 
  author, 
  role,
  delay = 0
}: { 
  quote: string; 
  author: string; 
  role: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="mb-4 text-3xl text-primary">"</div>
      <p className="text-muted-foreground mb-6 italic">{quote}</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
};

export default Index;
