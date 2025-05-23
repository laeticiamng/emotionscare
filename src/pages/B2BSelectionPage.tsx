
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, ArrowRight, Building2, UserCheck } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleRoleSelection = (role: 'b2b_user' | 'b2b_admin', path: string) => {
    setUserMode(role);
    localStorage.setItem('userMode', role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/5 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-blue-600 mr-4" />
            <span className="text-sm font-medium tracking-wider text-blue-600 uppercase">
              Solutions Entreprise
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white mb-6">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              espace professionnel
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Accédez à votre environnement EmotionsCare adapté à votre rôle et vos responsabilités
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Collaborateur Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-6 relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      className="absolute -inset-2 bg-blue-400/20 rounded-3xl -z-10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-light text-slate-900">
                    Espace Collaborateur
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600 leading-relaxed">
                    Votre parcours bien-être personnel au sein de votre organisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Analyses émotionnelles personnalisées et confidentielles
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Accès à la communauté d'entraide et de partage
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Ressources et exercices de bien-être adaptés
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Suivi de votre évolution émotionnelle
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleRoleSelection('b2b_user', '/b2b/user/login')}
                    className="w-full group py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Accéder à mon espace
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Administrateur Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-6 relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      className="absolute -inset-2 bg-indigo-400/20 rounded-3xl -z-10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-light text-slate-900">
                    Administration RH
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600 leading-relaxed">
                    Tableau de bord et outils de gestion pour votre organisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Vue d'ensemble du bien-être organisationnel
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Analytics et rapports détaillés anonymisés
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Outils de gestion des équipes et départements
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <p className="text-slate-700">
                        Tableau de bord temps réel et alertes
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleRoleSelection('b2b_admin', '/b2b/admin/login')}
                    className="w-full group py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Accéder au tableau de bord
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center"
          >
            <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-light text-slate-900 dark:text-white mb-4">
                Une approche sur-mesure pour chaque rôle
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                EmotionsCare s'adapte à vos besoins spécifiques, que vous soyez collaborateur 
                en quête de bien-être ou responsable RH soucieux du climat organisationnel.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-2 border-slate-300 hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Retour à l'accueil
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
