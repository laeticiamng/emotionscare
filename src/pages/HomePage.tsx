
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Heart, Users, Shield, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Heart className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">EmotionsCare</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="link" onClick={() => navigate('/b2c/login')}>
                Connexion
              </Button>
            </li>
            <li>
              <Button onClick={() => navigate('/b2c/register')}>
                S'inscrire
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Prenez soin de votre bien-être émotionnel
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Une plateforme complète dédiée à l'équilibre mental et émotionnel pour les particuliers et les entreprises.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/b2c/register')} className="text-lg">
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')} className="text-lg">
                Solutions entreprises
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-10">Nos services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 rounded-lg border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">Scan émotionnel</h4>
              <p className="text-muted-foreground mb-4">
                Analyse en temps réel de votre bien-être émotionnel et recommandations personnalisées.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/scan')}>
                En savoir plus
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card p-6 rounded-lg border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">Social Cocoon</h4>
              <p className="text-muted-foreground mb-4">
                Connectez-vous avec une communauté bienveillante pour partager et recevoir du soutien.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/social-cocoon')}>
                En savoir plus
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card p-6 rounded-lg border shadow-sm"
            >
              <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">Solution Entreprise</h4>
              <p className="text-muted-foreground mb-4">
                Outils de gestion du bien-être pour les équipes et analyses pour les managers.
              </p>
              <Button variant="link" className="p-0" onClick={() => navigate('/b2b/selection')}>
                En savoir plus
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h3 className="text-2xl font-bold mb-6">Commencez votre parcours de bien-être</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Que vous soyez un particulier cherchant à améliorer votre bien-être émotionnel ou une entreprise soucieuse du bien-être de vos équipes, EmotionsCare est là pour vous.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate('/b2c/login')}>
              Accès particulier
            </Button>
            <Button variant="outline" onClick={() => navigate('/b2b/selection')}>
              Accès entreprise
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="h-5 w-5 text-primary mr-2" />
              <span className="font-bold">EmotionsCare</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>
                À propos
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/contact')}>
                Contact
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/privacy')}>
                Confidentialité
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
