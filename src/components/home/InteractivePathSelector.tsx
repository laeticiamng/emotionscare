
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Heart, ArrowRight, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routerV2';

const InteractivePathSelector: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<'business' | 'personal' | null>(null);
  const navigate = useNavigate();

  const paths = [
    {
      id: 'business' as const,
      title: 'Entreprises',
      subtitle: 'Révélez l\'énergie collective',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      description: 'Votre structure est unique. Vos collaborateurs sont précieux. Leurs émotions nourrissent chaque jour la motivation, la créativité et l\'énergie collective.',
      features: [
        'L\'élan de se dépasser, l\'envie de s\'engager',
        'La sérénité face à la fatigue, la puissance face à la routine',
        'Des relations humaines vivantes, authentiques',
        'Un accompagnement sur-mesure qui évolue avec vous'
      ],
      cta: 'Découvrir l\'espace Entreprise',
      route: routes.b2b.home()
    },
    {
      id: 'personal' as const,
      title: 'Particuliers',
      subtitle: 'Votre parenthèse bien-être',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      description: 'Ouvrez une parenthèse. Un instant pour vous. Le luxe, c\'est de prendre le temps. Transformez chaque journée en petite respiration.',
      features: [
        'Une expérience sensorielle, élégante, apaisante',
        'Un cocon digital, discret, précieux',
        'Le plaisir d\'un bien-être sur-mesure, sans pression',
        'Le vrai luxe : s\'accorder du temps pour soi'
      ],
      cta: 'Découvrir l\'espace Personnel',
      route: routes.auth.b2cLogin()
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/30 to-purple-50/30 dark:from-slate-800/30 dark:to-slate-900/30">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="h-8 w-8 text-purple-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choisissez votre parcours
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Découvrez l'expérience EmotionsCare adaptée à vos besoins
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedPath(path.id)}
              onMouseLeave={() => setSelectedPath(null)}
            >
              <div className={`
                bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                ${selectedPath === path.id ? 'ring-2 ring-purple-300' : ''}
              `}>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${path.color} mb-6`}>
                  <path.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                  {path.title}
                </h3>
                
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">
                  {path.subtitle}
                </p>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {path.description}
                </p>

                <AnimatePresence>
                  {selectedPath === path.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <ul className="space-y-3">
                        {path.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <Users className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Button
                  onClick={() => navigate(path.route)}
                  className={`
                    w-full bg-gradient-to-r ${path.color} text-white font-semibold py-3 px-6 rounded-2xl
                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                    flex items-center justify-center gap-2
                  `}
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-3xl max-w-4xl mx-auto">
            <p className="text-xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Le luxe, c'est de prendre le temps. L'essentiel, retrouver une énergie partagée. 
              <span className="font-medium"> Révélez l'humain grâce aux émotions.</span>"
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractivePathSelector;
