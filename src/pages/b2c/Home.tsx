
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Music, BookOpen, Activity, Brain, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const B2CPage: React.FC = () => {
  const modules = [
    {
      icon: Heart,
      title: 'Journal émotionnel',
      description: 'Suivez et analysez vos émotions quotidiennes avec l\'accompagnement de notre IA',
      color: 'from-pink-500 to-rose-500',
      content: 'Accédez à votre journal émotionnel personnalisé pour enregistrer et analyser vos émotions au fil du temps. Notre IA vous accompagne dans cette introspection.'
    },
    {
      icon: Music,
      title: 'Thérapie musicale',
      description: 'Explorez des playlists adaptées à vos émotions et créez votre ambiance parfaite',
      color: 'from-purple-500 to-indigo-500',
      content: 'Découvrez des recommandations musicales basées sur votre état émotionnel actuel. Créez et personnalisez vos propres playlists thérapeutiques.'
    },
    {
      icon: BookOpen,
      title: 'Exercices de relaxation',
      description: 'Réduisez votre stress et anxiété avec des techniques personnalisées',
      color: 'from-green-500 to-emerald-500',
      content: 'Accédez à une bibliothèque d\'exercices de respiration, méditation et relaxation adaptés à votre niveau et vos besoins.'
    },
    {
      icon: Activity,
      title: 'Scan émotionnel',
      description: 'Analysez vos émotions en temps réel grâce à notre technologie avancée',
      color: 'from-blue-500 to-cyan-500',
      content: 'Utilisez notre scanner d\'émotions basé sur l\'IA pour comprendre votre état émotionnel instantanément et recevoir des conseils personnalisés.'
    },
    {
      icon: Brain,
      title: 'Coach IA personnel',
      description: 'Bénéficiez d\'un accompagnement personnalisé 24h/24',
      color: 'from-orange-500 to-red-500',
      content: 'Votre coach IA personnel vous accompagne avec des conseils adaptés à votre situation, vos objectifs et votre progression.'
    },
    {
      icon: Users,
      title: 'Communauté bienveillante',
      description: 'Rejoignez une communauté de soutien et partagez vos expériences',
      color: 'from-teal-500 to-green-500',
      content: 'Connectez-vous avec d\'autres personnes dans un environnement sécurisé et bienveillant pour partager et recevoir du soutien.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Espace Personnel
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Votre parenthèse bien-être personnalisée. Prenez le temps de vous reconnecter à vous-même dans un cocon digital élégant et apaisant.
          </p>
        </motion.div>

        {/* Philosophy reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 mb-12 max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl text-center text-slate-700 dark:text-slate-300 font-light italic leading-relaxed">
            "Le luxe, c'est de prendre le temps. Transformez chaque journée en petite respiration. 
            <span className="font-medium text-pink-600 dark:text-pink-400"> Le bien-être, tout simplement.</span>"
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${module.color} mx-auto mb-4`}>
                    <module.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {module.content}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${module.color} text-white font-semibold py-2 px-4 rounded-xl hover:scale-105 transition-transform duration-200`}
                  >
                    Découvrir
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 p-8 md:p-10 rounded-3xl max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800 dark:text-white">
              Prêt à commencer votre parcours bien-être ?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Rejoignez des milliers de personnes qui ont déjà trouvé leur équilibre avec EmotionsCare. 
              Votre bien-être mérite cette attention particulière.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl hover:scale-105 transition-transform duration-200 text-lg"
            >
              Commencer mon parcours
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CPage;
