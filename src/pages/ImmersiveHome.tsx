
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import ActionButtons from '@/components/home/ActionButtons';
import { Calendar, Users, Lightbulb, BookOpen, HeartHandshake, MessageSquare } from 'lucide-react';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Découvrez EmotionsCare
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une suite complète d'outils pour prendre soin de votre bien-être émotionnel et améliorer votre quotidien.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Journal Émotionnel</h3>
            <p className="text-muted-foreground mb-4">
              Suivez et analysez vos émotions quotidiennes pour mieux vous comprendre.
            </p>
            <Button onClick={() => navigate('/journal')} variant="outline" className="mt-2">
              Accéder au Journal
            </Button>
          </motion.div>

          <motion.div
            className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-800/30 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Événements</h3>
            <p className="text-muted-foreground mb-4">
              Participez à des ateliers et webinaires pour développer votre bien-être émotionnel.
            </p>
            <Button onClick={() => navigate('/events')} variant="outline" className="mt-2">
              Voir les Événements
            </Button>
          </motion.div>

          <motion.div
            className="rounded-xl bg-green-50 dark:bg-green-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Coach IA</h3>
            <p className="text-muted-foreground mb-4">
              Recevez des conseils personnalisés basés sur votre profil émotionnel.
            </p>
            <Button onClick={() => navigate('/coach')} variant="outline" className="mt-2">
              Consulter le Coach
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Solutions pour Entreprises
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Améliorez le bien-être de vos équipes avec nos outils spécifiquement conçus pour les organisations.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Gestion d'Équipes</h3>
            <p className="text-muted-foreground mb-4">
              Suivez et optimisez le bien-être de vos équipes en temps réel.
            </p>
            <Button onClick={() => navigate('/teams')} variant="outline" className="mt-2">
              Gérer les Équipes
            </Button>
          </motion.div>

          <motion.div
            className="rounded-xl bg-pink-50 dark:bg-pink-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-800/30 flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Optimisation</h3>
            <p className="text-muted-foreground mb-4">
              Analysez les données et obtenez des recommandations d'amélioration.
            </p>
            <Button onClick={() => navigate('/optimization')} variant="outline" className="mt-2">
              Voir les Optimisations
            </Button>
          </motion.div>

          <motion.div
            className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-6 shadow-sm"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800/30 flex items-center justify-center mb-4">
              <HeartHandshake className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Social</h3>
            <p className="text-muted-foreground mb-4">
              Un espace d'échange sécurisé pour vos collaborateurs.
            </p>
            <Button onClick={() => navigate('/social')} variant="outline" className="mt-2">
              Espace Social
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Button 
            onClick={() => navigate('/b2b/selection')} 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          >
            Explorer les solutions pour entreprise
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
