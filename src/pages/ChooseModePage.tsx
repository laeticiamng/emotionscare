
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Heart, Building2, Users, Stethoscope, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6" data-testid="page-root">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <p className="text-2xl text-gray-700 mb-4">Choisissez votre espace de bien-être</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Une solution complète de santé mentale et bien-être émotionnel, 
            adaptée aux besoins des particuliers et des organisations de santé.
          </p>
        </motion.div>

        {/* Cards de sélection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Espace Particulier */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pink-100 rounded-full">
                    <Heart className="h-12 w-12 text-pink-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Espace Particulier
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Votre accompagnement personnel vers le bien-être
                </p>
                <Badge className="mx-auto bg-pink-100 text-pink-800 border-pink-200">
                  Recommandé pour les professionnels de santé
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-pink-600" />
                    Fonctionnalités principales
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Scanner émotionnel intelligent",
                      "Coach IA personnalisé 24/7",
                      "Musicothérapie adaptative",
                      "Journal de bien-être interactif",
                      "Expériences VR immersives",
                      "Suivi des progrès personnalisés",
                      "Gamification motivante",
                      "Communauté bienveillante"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h5 className="font-medium text-pink-900 mb-2">🎯 Spécialement conçu pour :</h5>
                  <ul className="text-sm text-pink-700 space-y-1">
                    <li>• Médecins, infirmiers, soignants</li>
                    <li>• Gestion du stress professionnel</li>
                    <li>• Prévention du burn-out</li>
                    <li>• Équilibre vie pro/perso</li>
                  </ul>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/b2c')}
                >
                  Accéder à l'espace particulier
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Espace Entreprise */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Building2 className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Espace Entreprise
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Solution complète pour le bien-être organisationnel
                </p>
                <Badge className="mx-auto bg-blue-100 text-blue-800 border-blue-200">
                  Gestion d'équipes et analytics avancés
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Fonctionnalités entreprise
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Tableau de bord équipes en temps réel",
                      "Analytics et rapports détaillés",
                      "Gestion des utilisateurs avancée",
                      "Événements et formations bien-être",
                      "Interventions personnalisées",
                      "Conformité RGPD garantie",
                      "Optimisation continue par IA",
                      "Support et intégrations"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">🏥 Idéal pour :</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Hôpitaux et cliniques</li>
                    <li>• Services de soins médicaux</li>
                    <li>• Équipes de direction RH</li>
                    <li>• Responsables qualité de vie</li>
                  </ul>
                </div>

                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/b2b/selection')}
                >
                  Accéder à l'espace entreprise
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section avantages */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Pourquoi choisir EmotionsCare ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurité Garantie</h3>
              <p className="text-gray-600">
                Conformité RGPD, chiffrement end-to-end et anonymisation complète des données sensibles.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">IA Avancée</h3>
              <p className="text-gray-600">
                Intelligence artificielle de pointe pour des analyses émotionnelles précises et des recommandations personnalisées.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approche Humaine</h3>
              <p className="text-gray-600">
                Technologie au service de l'humain avec une approche bienveillante et respectueuse de chaque individu.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div className="text-center" variants={itemVariants}>
          <p className="text-gray-600 mb-6">
            Vous hésitez encore ? Découvrez notre solution en action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
            <Button variant="outline" size="lg">
              Voir la démo
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
