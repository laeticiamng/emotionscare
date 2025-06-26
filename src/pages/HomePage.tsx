
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Users, 
  Music, 
  BookOpen, 
  Shield, 
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Scanner Émotionnel IA",
      description: "Analysez vos émotions en temps réel avec une intelligence artificielle avancée",
      color: "text-blue-500"
    },
    {
      icon: Music,
      title: "Musicothérapie Adaptive",
      description: "Musique personnalisée selon votre état émotionnel pour un bien-être optimal",
      color: "text-purple-500"
    },
    {
      icon: Heart,
      title: "Coach IA Personnel",
      description: "Accompagnement personnalisé 24h/24 par votre coach en bien-être émotionnel",
      color: "text-red-500"
    },
    {
      icon: BookOpen,
      title: "Journal Intelligent",
      description: "Suivez votre progression avec des insights automatiques et des analyses",
      color: "text-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Marie Dubois",
      role: "Médecin urgentiste",
      content: "EmotionsCare m'aide à gérer le stress quotidien. L'interface est intuitive et les recommandations très pertinentes.",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Infirmier en réanimation",
      content: "Le coach IA comprend vraiment mes besoins. C'est devenu indispensable dans ma routine de bien-être.",
      rating: 5
    },
    {
      name: "Sarah Leroy",
      role: "Psychologue hospitalière",
      content: "Excellent outil pour accompagner mes collègues. Les données sont précieuses pour notre équipe.",
      rating: 5
    }
  ];

  const stats = [
    { value: "10,000+", label: "Professionnels de santé" },
    { value: "95%", label: "Satisfaction utilisateur" },
    { value: "24/7", label: "Disponibilité" },
    { value: "ISO 27001", label: "Certification sécurité" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">EmotionsCare</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/about')}>
              À propos
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contact')}>
              Contact
            </Button>
            <Button onClick={() => navigate('/choose-mode')} className="bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Votre bien-être émotionnel,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}notre priorité
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              La plateforme de bien-être émotionnel dédiée aux professionnels de santé. 
              IA avancée, musicothérapie, coaching personnalisé et suivi intelligent.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/choose-mode')}
                className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Commencer gratuitement
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des outils innovants conçus spécifiquement pour les professionnels de santé
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full bg-gray-50 ${feature.color}`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos utilisateurs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white shadow-lg border-0">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels de santé qui ont déjà amélioré 
              leur qualité de vie avec EmotionsCare.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/choose-mode')}
                className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
              >
                Commencer maintenant
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
              >
                Planifier une démo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La solution de bien-être émotionnel de référence pour les professionnels de santé.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Données sécurisées et conformes RGPD</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
