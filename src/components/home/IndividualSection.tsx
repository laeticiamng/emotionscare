
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, Heart, Clock, ArrowRight, Leaf } from 'lucide-react';

const IndividualSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Une expérience sensorielle",
      description: "Une interface sobre, la douceur des sons, une lumière choisie."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Des ressources personnalisées",
      description: "Modules guidés, rituels courts, parcours sur-mesure pour chaque situation."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Le plaisir sans pression",
      description: "Pas de compétition, pas d'injonction. Le plaisir de se retrouver."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-900/20 dark:via-slate-900 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Leaf className="h-10 w-10 text-emerald-600 mr-4" />
            <h2 className="text-5xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white">
              Particuliers
            </h2>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-emerald-600 mt-1 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-slate-900 mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="space-y-6">
              <motion.h3
                className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white leading-tight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Ouvrez une parenthèse.{' '}
                <span className="text-emerald-600">Un instant pour vous.</span>
              </motion.h3>
              
              <motion.p
                className="text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Le luxe, c'est de prendre le temps.
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Transformez chaque journée en petite respiration. Simplement.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Des moments pour ralentir et vous reconnecter. Retrouvez le plaisir d'être là. Vraiment.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Chaque détail est pensé pour vous. Uniquement.
                </p>
              </motion.div>

              <div className="border-l-4 border-emerald-400 pl-6 space-y-4">
                <p className="text-lg text-emerald-700 dark:text-emerald-300 leading-relaxed italic">
                  Une pause, une douceur. Un équilibre discret, mais précieux. 
                  Le bien-être, tout simplement. Vivez. Chaque respiration compte.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Button
                onClick={() => navigate('/login?segment=b2c')}
                size="lg"
                className="group px-8 py-6 text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Commencer votre voyage
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-center mt-20"
        >
          <div className="max-w-4xl mx-auto space-y-6 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-3xl">
            <h3 className="text-2xl font-light text-slate-900 dark:text-white">
              Le vrai luxe, c'est de s'accorder du temps
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Nourrissez votre équilibre, apaisez vos tensions, éclairez votre quotidien. 
              Parce qu'avec EmotionsCare, le bien-être ne s'explique pas, il se vit.
            </p>
            <p className="text-lg font-light text-emerald-600 dark:text-emerald-400 italic">
              EmotionsCare. Le bien-être, tout simplement. Le luxe, c'est de prendre le temps.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndividualSection;
