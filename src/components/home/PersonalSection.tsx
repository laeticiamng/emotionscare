
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Leaf, Clock } from 'lucide-react';

const PersonalSection: React.FC = () => {
  const experiences = [
    {
      icon: Sparkles,
      title: "Une expérience sensorielle",
      description: "Élégante, apaisante, pensée pour votre bien-être."
    },
    {
      icon: Heart,
      title: "Un cocon digital",
      description: "Discret, précieux, loin de la frénésie du quotidien."
    },
    {
      icon: Leaf,
      title: "Un bien-être sur-mesure",
      description: "Sans pression, sans objectif à atteindre. Le plaisir de se retrouver."
    },
    {
      icon: Clock,
      title: "Le luxe du temps",
      description: "S'accorder du temps pour nourrir son équilibre, apaiser ses tensions."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/50 dark:from-slate-900 dark:to-slate-800/50">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
            Particuliers
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Ouvrez une parenthèse. Un instant pour vous. 
              <span className="text-pink-600 dark:text-pink-400"> Le luxe, c'est de prendre le temps.</span>
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Transformez chaque journée en petite respiration. Simplement.
            </p>
            <p className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
              Des moments pour ralentir et vous reconnecter. Retrouvez le plaisir d'être là.
              <br />
              <span className="font-medium">Le bien-être, tout simplement. Vivez.</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-slate-800 dark:text-white">
            Avec EmotionsCare, vous retrouvez :
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
                    <experience.icon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                      {experience.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 p-8 md:p-10 rounded-3xl max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              <span className="font-semibold">Pas de compétition, pas d'injonction.</span> Le plaisir de se retrouver.
            </p>
            <p className="text-xl md:text-2xl font-medium text-pink-600 dark:text-pink-400 leading-relaxed mb-6">
              Car le vrai luxe, c'est de s'accorder du temps.
            </p>
            <p className="text-lg md:text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
              Parce qu'avec EmotionsCare, le bien-être ne s'explique pas, il se vit.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PersonalSection;
