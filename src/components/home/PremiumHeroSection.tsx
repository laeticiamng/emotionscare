
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Heart, Sparkles, Users } from 'lucide-react';

const PremiumHeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Hero Principal */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </h1>
              <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Le bien-être ne s'explique pas, il se vit.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Notre ambition : offrir à chacun une parenthèse pour soi, à chaque équipe une énergie partagée. 
                Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve dans l'énergie partagée.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button
                onClick={() => navigate('/choose-mode')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Découvrir l'expérience
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Entreprises */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
              🏢 Entreprises
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Votre structure est unique. Votre équipe a son histoire. Vos collaborateurs sont précieux. 
                Vos soignants sont indispensables. Leurs émotions comptent. Elles nourrissent chaque jour 
                la motivation, la créativité, la confiance et l'énergie.
              </p>
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                EmotionsCare, bien plus qu'une plateforme : c'est l'alliance de la technologie et du ressenti, 
                au service de l'énergie et de l'excellence collective.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Avec EmotionsCare, vous offrez à vos équipes :
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>L'élan de se dépasser, l'envie de s'engager.</strong> L'énergie circule, 
                    l'enthousiasme renaît, la fierté d'appartenir à un collectif vivant s'installe.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>La sérénité face à la fatigue.</strong> Chacun retrouve ce souffle dont il a besoin, 
                    même quand la pression monte ou que la lassitude s'installe.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Des relations humaines vivantes, authentiques.</strong> La reconnaissance et l'écoute 
                    réactivent l'énergie du groupe, la cohésion.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Un accompagnement sur-mesure.</strong> EmotionsCare s'adapte à vos défis, 
                    maintient cette énergie vivante, durable, contagieuse.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl"
            >
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Pourquoi EmotionsCare ?
              </h4>
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Ce qui fait la différence, c'est l'énergie qui relie, qui donne envie, qui fait durer vos réussites. 
                Avec EmotionsCare, votre organisation retrouve ce souffle collectif essentiel.
              </p>
              <Button
                onClick={() => navigate('/b2b/selection')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Découvrir l'espace entreprise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Particuliers */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Heart className="h-12 w-12 text-pink-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
              🌱 Particuliers
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-2xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Ouvrez une parenthèse. Un instant pour vous. Le luxe, c'est de prendre le temps.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Transformez chaque journée en petite respiration. Simplement. Des moments pour ralentir 
                et vous reconnecter. Retrouvez le plaisir d'être là. Vraiment.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Expérience sensorielle
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Une interface sobre, la douceur des sons, une lumière choisie. 
                Une invitation à la détente, à la clarté.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Ressources adaptées
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Modules guidés, rituels courts, parcours personnalisés. 
                Chaque pause devient un vrai moment d'être mieux.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                Bien-être sur-mesure
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                Sans pression, sans objectif à atteindre. 
                Le plaisir de se retrouver, de s'accorder du temps.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => navigate('/b2c/register')}
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Commencer votre voyage
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">
              🌟 Découvrez, vivez, partagez l'expérience émotionnelle
            </h3>
            <p className="text-xl text-slate-300 mb-6">
              EmotionsCare. Le bien-être, tout simplement. Le luxe, c'est de prendre le temps.
            </p>
            <p className="text-slate-400">
              EmotionsCare SASU - Révélez l'humain grâce aux émotions
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumHeroSection;
