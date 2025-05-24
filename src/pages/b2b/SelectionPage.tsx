
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, ArrowLeft, CheckCircle, Building2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const collaboratorFeatures = [
    "Scanner émotionnel personnel et confidentiel",
    "Coach IA personnalisé pour votre bien-être",
    "Musicothérapie adaptative selon votre humeur",
    "Participation aux défis d'équipe motivants",
    "Accès au cocon social sécurisé",
    "Journal émotionnel privé et insights"
  ];

  const adminFeatures = [
    "Tableau de bord analytique complet",
    "Gestion des équipes et des utilisateurs",
    "Rapports de bien-être agrégés et anonymes",
    "Configuration des ressources et contenus",
    "Optimisation organisationnelle basée sur les données",
    "Suivi des tendances émotionnelles collectives"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header avec retour */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Solutions <span className="text-primary">Entreprise</span>
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Cultivez l'énergie partagée et le bien-être collectif au sein de votre organisation. 
            Choisissez votre profil d'accès pour commencer.
          </p>
          
          {/* Citation philosophique */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl max-w-4xl mx-auto">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <p className="text-lg italic text-slate-700 dark:text-slate-300">
              "Dans le collectif naît une force nouvelle, une synergie qui élève chacun vers le meilleur de lui-même."
            </p>
          </div>
        </motion.div>

        {/* Cartes de sélection */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Collaborateur */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="h-full shadow-xl border-2 hover:shadow-2xl transition-all duration-300 group hover:border-primary/50">
              <CardHeader className="text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 pb-8">
                <div className="mx-auto p-6 rounded-full bg-white/80 dark:bg-slate-800/80 mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
                  Collaborateur
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Votre parenthèse bien-être au travail
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  {collaboratorFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Link to="/b2b/user/login">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/b2b/user/register">
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Administrateur */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full shadow-xl border-2 hover:shadow-2xl transition-all duration-300 group hover:border-primary/50">
              <CardHeader className="text-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 pb-8">
                <div className="mx-auto p-6 rounded-full bg-white/80 dark:bg-slate-800/80 mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                  Administrateur RH
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Pilotage du bien-être organisationnel
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  {adminFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <Link to="/b2b/admin/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 font-semibold">
                    Accès Administrateur
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section valeurs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-blue-900/20 border-0">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-6">Nos engagements pour votre entreprise</h3>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Confidentialité absolue</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Chaque donnée personnelle reste privée et sécurisée
                  </p>
                </div>
                <div>
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Synergie collective</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Des outils qui renforcent la cohésion sans contrainte
                  </p>
                </div>
                <div>
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Conformité RGPD</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Respect total de la réglementation et des droits
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
