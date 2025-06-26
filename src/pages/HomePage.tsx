
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Users, 
  Shield, 
  Zap, 
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Award,
  Headphones,
  Calendar,
  BarChart3
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "IA Coach Personnel",
      description: "Un assistant intelligent qui s'adapte à vos besoins émotionnels",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Heart,
      title: "Scan Émotionnel",
      description: "Analyse en temps réel de votre état émotionnel",
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Headphones,
      title: "Musicothérapie",
      description: "Playlists personnalisées selon votre humeur",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Calendar,
      title: "Suivi Personnalisé",
      description: "Tableaux de bord et insights sur votre bien-être",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Partagez et connectez-vous avec d'autres utilisateurs",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      icon: Shield,
      title: "Sécurisé & Privé",
      description: "Vos données sont protégées et confidentielles",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Martin",
      role: "Psychologue clinicienne",
      content: "EmotionsCare révolutionne la façon dont nous abordons le bien-être émotionnel en milieu professionnel.",
      rating: 5,
      avatar: "/avatars/dr-martin.jpg"
    },
    {
      name: "Jean Dupont",
      role: "Infirmier en service d'urgence",
      content: "Grâce à l'IA Coach, j'ai appris à mieux gérer mon stress quotidien. Un outil indispensable !",
      rating: 5,
      avatar: "/avatars/jean-dupont.jpg"
    },
    {
      name: "Marie Dubois",
      role: "Directrice RH - Hôpital Saint-Louis",
      content: "Les analytics nous permettent de mieux comprendre et soutenir nos équipes soignantes.",
      rating: 5,
      avatar: "/avatars/marie-dubois.jpg"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Professionnels de santé" },
    { number: "95%", label: "Taux de satisfaction" },
    { number: "200+", label: "Établissements partenaires" },
    { number: "24/7", label: "Support disponible" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center items-center mb-8">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Heart className="h-16 w-16 text-blue-600" />
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EmotionsCare
                </h1>
                <Brain className="h-16 w-16 text-purple-600" />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-700 mb-6 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              La plateforme de bien-être émotionnel dédiée aux professionnels de santé
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Découvrez une solution complète avec IA Coach, scan émotionnel, musicothérapie et suivi personnalisé 
              pour prendre soin de votre santé mentale au quotidien.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/choose-mode">
                <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Play className="mr-2 h-5 w-5" />
                  Commencer maintenant
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 hover:bg-gray-50">
                Découvrir les fonctionnalités
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Demo Video Placeholder */}
            <motion.div 
              className="relative max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-2xl flex items-center justify-center">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  <Play className="h-12 w-12" />
                  <span className="ml-4 text-xl">Regarder la démo</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-blue-600 border-blue-600">
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Tout ce dont vous avez besoin</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une suite complète d'outils pour votre bien-être émotionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-purple-600 border-purple-600">
              Témoignages
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Ce que disent nos utilisateurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez l'impact d'EmotionsCare sur la vie des professionnels de santé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
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
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Award className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-4xl font-bold mb-6">
              Prêt à transformer votre bien-être émotionnel ?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Rejoignez des milliers de professionnels de santé qui ont déjà amélioré leur qualité de vie avec EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/choose-mode">
                <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-900 hover:bg-gray-100">
                  <Zap className="mr-2 h-5 w-5" />
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                  Contactez-nous
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour le bien-être émotionnel des professionnels de santé.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/scan" className="hover:text-white transition-colors">Scan Émotionnel</Link></li>
                <li><Link to="/coach" className="hover:text-white transition-colors">IA Coach</Link></li>
                <li><Link to="/music" className="hover:text-white transition-colors">Musicothérapie</Link></li>
                <li><Link to="/vr" className="hover:text-white transition-colors">Réalité Virtuelle</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Certifications</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">RGPD Conforme</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm text-gray-400">ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-400">HAS Agréé</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
