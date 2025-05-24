
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Clock, Zap, ArrowRight, Brain, Building2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhilosophySection from '@/components/home/PhilosophySection';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [activePhilosophy, setActivePhilosophy] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const philosophyPillars = [
    {
      icon: Heart,
      title: "La parenthèse personnelle",
      description: "Chaque individu mérite un moment de pause, un espace sacré pour se reconnecter à soi-même.",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950"
    },
    {
      icon: Users,
      title: "L'énergie partagée",
      description: "Dans le collectif naît une force nouvelle, une synergie qui élève chacun vers le meilleur de lui-même.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      icon: Clock,
      title: "Le temps comme luxe",
      description: "Redéfinir le temps non comme une contrainte mais comme un cadeau précieux à s'offrir.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      icon: Zap,
      title: "L'essentiel révélé",
      description: "Dans le partage d'énergie positive, l'essentiel émerge naturellement, authentiquement.",
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section avec philosophie */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-4xl mx-auto leading-relaxed">
            Offrir à chacun une parenthèse, à chaque équipe une énergie partagée.
            Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve dans l'énergie partagée.
          </p>

          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            className="mb-12 border-2 hover:bg-primary/5"
          >
            Découvrir notre philosophie
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </Button>
        </motion.div>

        {/* Parcours interactif de la philosophie */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-6xl mx-auto mb-16"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {philosophyPillars.map((pillar, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setActivePhilosophy(index)}
                    onHoverEnd={() => setActivePhilosophy(null)}
                    className="cursor-pointer"
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      activePhilosophy === index 
                        ? 'shadow-lg scale-105 border-primary' 
                        : 'shadow-md hover:shadow-lg'
                    }`}>
                      <CardHeader className="text-center">
                        <div className={`mx-auto p-4 rounded-full ${pillar.bgColor} mb-4`}>
                          <pillar.icon className={`h-8 w-8 ${pillar.color}`} />
                        </div>
                        <CardTitle className="text-lg">{pillar.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {pillar.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Sections séparées Particuliers et Entreprises */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Votre parcours de <span className="text-primary">bien-être</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Que vous soyez un particulier en quête d'équilibre ou une entreprise 
              soucieuse du bien-être de ses équipes, nous avons la solution adaptée.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Section Particuliers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-xl border-2 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
                  <div className="mx-auto p-6 rounded-full bg-white/80 dark:bg-slate-800/80 mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-12 w-12 text-pink-500" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Espace Personnel</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Votre parenthèse quotidienne pour retrouver l'équilibre
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Brain className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Scanner d'émotions IA</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Analysez votre état émotionnel avec notre technologie avancée
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Coach personnel IA</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Accompagnement personnalisé adapté à votre situation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-pink-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Musicothérapie adaptive</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Sons apaisants personnalisés selon votre humeur
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/b2c/login')}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full font-semibold"
                    size="lg"
                  >
                    Commencer mon parcours
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section Entreprises */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-xl border-2 hover:shadow-2xl transition-all duration-300 group">
                <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <div className="mx-auto p-6 rounded-full bg-white/80 dark:bg-slate-800/80 mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="h-12 w-12 text-blue-500" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Espace Entreprise</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    L'énergie partagée au service de vos équipes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Cocon social sécurisé</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Espace bienveillant pour le partage et l'entraide
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Défis d'équipe</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Challenges collaboratifs pour renforcer la cohésion
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Analytics RH</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Tableaux de bord pour optimiser le bien-être collectif
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/b2b/selection')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold"
                    size="lg"
                  >
                    Découvrir nos solutions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section philosophie détaillée */}
      <PhilosophySection />

      {/* Call to Action final */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre rapport au bien-être ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs qui ont déjà fait le choix d'EmotionsCare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/b2c/login')}
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Commencer gratuitement
            </Button>
            <Button 
              onClick={() => navigate('/b2b/selection')}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Solutions entreprise
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ImmersiveHome;
