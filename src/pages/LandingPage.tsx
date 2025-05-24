
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Music, 
  BarChart3, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Scanner d\'émotions IA',
      description: 'Analysez vos émotions en temps réel grâce à notre intelligence artificielle avancée'
    },
    {
      icon: Music,
      title: 'Thérapie musicale',
      description: 'Musiques personnalisées générées par IA pour améliorer votre bien-être'
    },
    {
      icon: BarChart3,
      title: 'Analytics avancées',
      description: 'Suivez votre évolution émotionnelle avec des graphiques détaillés'
    },
    {
      icon: Shield,
      title: 'Sécurité RGPD',
      description: 'Vos données sont protégées selon les standards européens les plus stricts'
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Manager',
      content: 'EmotionsCare m\'a aidée à mieux comprendre mes émotions et celles de mon équipe.',
      rating: 5
    },
    {
      name: 'Thomas P.',
      role: 'Développeur',
      content: 'L\'interface est intuitive et les analyses sont vraiment pertinentes.',
      rating: 5
    },
    {
      name: 'Sophie M.',
      role: 'RH',
      content: 'Un outil précieux pour le bien-être en entreprise.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Heart className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-800 dark:text-white">
            EmotionsCare
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
          >
            Se connecter
          </Button>
          <Button 
            onClick={() => navigate('/choose-mode')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Commencer
          </Button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Votre bien-être émotionnel,
            <br />
            notre priorité
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12">
            Découvrez la première plateforme française qui utilise l'intelligence artificielle 
            pour analyser, comprendre et améliorer votre bien-être émotionnel au quotidien.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/b2b/selection')}
              className="text-lg px-8 py-6"
            >
              Solutions entreprise
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              3 jours d'essai gratuit
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Conforme RGPD
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Support français
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">
            Des outils innovants pour votre bien-être
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Notre plateforme combine les dernières avancées en IA avec des approches 
            thérapeutiques éprouvées pour vous offrir une expérience unique.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl my-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Découvrez les témoignages de nos utilisateurs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-slate-500">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-8" />
          <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être 
            grâce à EmotionsCare. Votre premier pas vers un mieux-être commence maintenant.
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/choose-mode')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6"
          >
            Commencer mon essai gratuit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-800 dark:text-white">
                EmotionsCare
              </span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400">
              <button>Conditions d'utilisation</button>
              <button>Politique de confidentialité</button>
              <button>Contact</button>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-slate-500">
            © 2024 EmotionsCare. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
