
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, User, Building, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">EmotionsCare</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/choose-mode')}>Connexion</Button>
          <Button onClick={() => navigate('/choose-mode')}>Inscription</Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/20 dark:to-background">
        <div className="container mx-auto text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-4 px-3 py-1 text-sm">Nouvelle version</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-primary dark:to-blue-400">
              Prenez soin de votre bien-être émotionnel
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Découvrez une approche innovante pour comprendre, suivre et améliorer votre bien-être grâce à l'intelligence artificielle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/choose-mode')}
                className="text-lg py-6 px-8"
              >
                Commencer gratuitement
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/b2b/selection')}
                className="text-lg py-6 px-8"
              >
                Solutions entreprise
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre approche unique
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EmotionsCare combine les dernières avancées en intelligence artificielle avec des pratiques éprouvées de bien-être.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyse émotionnelle</h3>
              <p className="text-muted-foreground">
                Notre scanner d'émotions analyse votre texte, vos expressions faciales et votre voix pour évaluer votre état émotionnel avec précision.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coach IA personnalisé</h3>
              <p className="text-muted-foreground">
                Recevez des conseils et des exercices personnalisés basés sur votre profil émotionnel unique et vos objectifs de bien-être.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M9 18V5l12 13V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thérapie musicale</h3>
              <p className="text-muted-foreground">
                Explorez des playlists conçues par l'IA adaptées à votre état émotionnel et découvrez comment la musique peut transformer votre humeur.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 14C8.5 15.5 10 16.5 12 16.5C14 16.5 15.5 15.5 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 9H9.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M15 9H15.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Journal émotionnel</h3>
              <p className="text-muted-foreground">
                Documentez votre parcours émotionnel et bénéficiez d'insights générés par l'IA pour mieux comprendre vos tendances et schémas.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expériences VR immersives</h3>
              <p className="text-muted-foreground">
                Immergez-vous dans des environnements virtuels conçus pour la relaxation, la méditation et la réduction du stress.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Solutions entreprise</h3>
              <p className="text-muted-foreground">
                Programmes spécialisés pour les organisations souhaitant améliorer le bien-être de leurs équipes et leur productivité.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment EmotionsCare a transformé la vie de nos utilisateurs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card rounded-lg p-6 border"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Marie D.</h3>
                  <p className="text-sm text-muted-foreground">Utilisatrice depuis 8 mois</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "En tant que professionnelle occupée, j'avais du mal à gérer mon stress. EmotionsCare m'a aidée à comprendre mes déclencheurs émotionnels et à développer des stratégies efficaces."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card rounded-lg p-6 border"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Thomas B.</h3>
                  <p className="text-sm text-muted-foreground">Utilisateur depuis 5 mois</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "La thérapie musicale et les exercices VR ont complètement transformé mes habitudes de relaxation. Je me sens plus calme et plus centré que jamais."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card rounded-lg p-6 border"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Entreprise XYZ</h3>
                  <p className="text-sm text-muted-foreground">Solution B2B depuis 1 an</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Depuis l'intégration d'EmotionsCare dans notre programme de bien-être, nous avons observé une réduction de 30% du stress chez nos employés et une augmentation de la productivité."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Solutions Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Solutions adaptées à vos besoins
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez un particulier ou une entreprise, EmotionsCare a une solution pour vous.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card border rounded-lg p-8 hover:shadow-md transition-all"
            >
              <div className="mb-6">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pour les particuliers</h3>
              <ul className="space-y-3">
                {[
                  'Analyse émotionnelle avec IA',
                  'Coach personnel 24/7',
                  'Journal émotionnel avec insights',
                  'Thérapie musicale personnalisée',
                  'Expériences VR immersives'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                onClick={() => navigate('/b2c/register')}
              >
                Créer un compte personnel
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card border rounded-lg p-8 hover:shadow-md transition-all"
            >
              <div className="mb-6">
                <Building className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pour les entreprises</h3>
              <ul className="space-y-3">
                {[
                  'Tableau de bord bien-être d\'équipe',
                  'Analytics et rapports détaillés',
                  'Intégration aux programmes RH',
                  'Défis d\'équipe et gamification',
                  'Formations et webinaires personnalisés'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6" 
                onClick={() => navigate('/b2b/selection')}
              >
                Découvrir les solutions B2B
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre bien-être émotionnel ?
            </h2>
            <p className="text-xl mb-6 text-muted-foreground">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie grâce à EmotionsCare.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/choose-mode')}
              className="text-lg py-6 px-8"
            >
              Commencer maintenant
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-muted-foreground">
                Transformez votre bien-être émotionnel grâce à l'intelligence artificielle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Particuliers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Entreprises</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Professionnels de santé</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Études de cas</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Base de connaissances</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">À propos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contactez-nous</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
