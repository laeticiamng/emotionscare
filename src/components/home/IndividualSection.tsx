
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Stethoscope, Heart, Brain, ArrowRight, Shield } from 'lucide-react';

const IndividualSection: React.FC = () => {
  const navigate = useNavigate();

  const profiles = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Étudiants en santé",
      description: "Gérer le stress des examens, la pression des stages, les premières confrontations à la maladie."
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: "Soignants en activité",
      description: "Prévenir l'épuisement, récupérer après les gardes, maintenir son équilibre au quotidien."
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Internes & résidents",
      description: "Naviguer entre apprentissage intense et responsabilités croissantes sans s'oublier."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-slate-900 dark:to-teal-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-emerald-600 mr-4" />
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white">
              Pour vous, individuellement
            </h2>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Parce que personne ne prend soin de ceux qui prennent soin.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="grid gap-6">
              {profiles.map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-emerald-600 mt-1 group-hover:scale-110 transition-transform duration-300">
                          {profile.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                            {profile.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {profile.description}
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
                Tenir dans la durée.{' '}
                <span className="text-emerald-600">Sans s'oublier.</span>
              </motion.h3>
              
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Le stress des examens. La pression des responsabilités. La fatigue émotionnelle du soin.
                </p>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Des outils de régulation émotionnelle pensés pour votre réalité, accessibles en quelques minutes.
                </p>
              </motion.div>

              <div className="border-l-4 border-emerald-400 pl-6 space-y-4">
                <p className="text-lg text-emerald-700 dark:text-emerald-300 leading-relaxed italic">
                  "Aider les acteurs du soin à réguler leur état émotionnel pour apprendre, soigner et ne pas s'épuiser."
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Button
                onClick={() => navigate('/login?segment=b2c')}
                size="lg"
                className="group px-8 py-6 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-20"
        >
          <div className="max-w-4xl mx-auto space-y-6 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl">
            <div className="flex justify-center mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-light text-slate-900 dark:text-white">
              Confidentialité totale
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Vos données restent privées. Vous choisissez ce que vous partagez. 
              Aucune image, aucun enregistrement n'est stocké sans votre consentement explicite.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndividualSection;
