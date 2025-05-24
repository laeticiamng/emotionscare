
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Zap, Shield, Users, Heart } from 'lucide-react';

const BusinessSection: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: "L'élan de se dépasser",
      description: "L'énergie circule, la fierté d'appartenir à un collectif vivant s'installe."
    },
    {
      icon: Shield,
      title: "La sérénité face à la fatigue",
      description: "Chacun retrouve ce souffle dont il a besoin, même quand la pression monte."
    },
    {
      icon: Heart,
      title: "Des relations humaines vivantes",
      description: "La reconnaissance et l'écoute réactivent l'énergie du groupe, la cohésion."
    },
    {
      icon: Users,
      title: "Un accompagnement sur-mesure",
      description: "Qui évolue avec vous et s'adapte aux besoins de votre organisation."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Building2 className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-white">
            Entreprises
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold">Votre structure est unique. Vos collaborateurs sont précieux. Vos soignants sont indispensables.</span>
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Leurs émotions comptent. Elles nourrissent chaque jour la motivation, la créativité, la confiance et l'énergie.
            </p>
            <p className="text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 leading-relaxed">
              EmotionsCare, bien plus qu'une plateforme : c'est l'alliance de la technologie et du ressenti, 
              au service de l'énergie et de l'excellence collective.
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
            Avec EmotionsCare, vous offrez à vos équipes :
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {benefit.description}
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
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 md:p-10 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800 dark:text-white">
              Pourquoi EmotionsCare ?
            </h3>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              Ce qui fait la différence, c'est l'énergie qui relie, qui fait durer vos réussites.
            </p>
            <p className="text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 leading-relaxed">
              Avec EmotionsCare, votre organisation retrouve ce souffle collectif essentiel, 
              cette vitalité qui inspire et engage.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessSection;
