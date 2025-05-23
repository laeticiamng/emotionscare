
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Heart, Zap, ArrowRight } from 'lucide-react';

const BusinessSection: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "L'élan de se dépasser",
      description: "L'énergie circule, l'enthousiasme renaît, la fierté d'appartenir à un collectif vivant s'installe."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "La sérénité face à la fatigue",
      description: "Chacun retrouve ce souffle dont il a besoin, même quand la pression monte ou que la lassitude s'installe."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Des relations humaines vivantes",
      description: "La reconnaissance et l'écoute réactivent l'énergie du groupe, la cohésion, l'envie d'aller plus loin ensemble."
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Un accompagnement sur-mesure",
      description: "EmotionsCare s'adapte à vos défis, suit vos évolutions, pour maintenir cette énergie vivante, durable, contagieuse."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-blue-400 mr-4" />
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Entreprises
            </h2>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <p className="text-xl font-light leading-relaxed text-blue-100">
                Votre structure est unique. Votre équipe a son histoire. 
                Vos collaborateurs sont précieux. Vos soignants sont indispensables.
              </p>
              <p className="text-lg font-light leading-relaxed text-slate-300">
                Leurs émotions comptent. Elles nourrissent chaque jour la motivation, 
                la créativité, la confiance et l'énergie.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-6 space-y-4">
              <h3 className="text-2xl font-medium text-white">
                EmotionsCare, bien plus qu'une plateforme
              </h3>
              <p className="text-lg text-blue-100 leading-relaxed">
                C'est l'alliance de la technologie et du ressenti, au service de l'énergie 
                et de l'excellence collective, pour ceux qui comptent vraiment.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={() => navigate('/b2b/selection')}
                size="lg"
                className="group px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Découvrir nos solutions
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-blue-400 mt-1">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-white mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-blue-100 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            <h3 className="text-3xl font-light text-white">
              Pourquoi EmotionsCare ?
            </h3>
            <p className="text-xl text-blue-100 leading-relaxed">
              Ce qui fait la différence, c'est l'énergie qui relie, qui donne envie, 
              qui fait durer vos réussites. Avec EmotionsCare, votre organisation retrouve 
              ce souffle collectif essentiel, cette vitalité qui inspire, engage, transforme.
            </p>
            <p className="text-lg font-light text-slate-300 italic">
              EmotionsCare. Le luxe, c'est de prendre le temps. L'essentiel, 
              retrouver une énergie partagée. Révélez l'humain grâce aux émotions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessSection;
