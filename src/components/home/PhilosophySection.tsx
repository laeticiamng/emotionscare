
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Users, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PhilosophySection: React.FC = () => {
  const navigate = useNavigate();
  
  const values = [
    {
      icon: Heart,
      title: "La parenthèse personnelle",
      description: "Chaque individu mérite un moment de pause, un espace sacré pour se reconnecter à soi-même.",
      color: "text-pink-500"
    },
    {
      icon: Users,
      title: "L'énergie partagée",
      description: "Dans le collectif naît une force nouvelle, une synergie qui élève chacun vers le meilleur de lui-même.",
      color: "text-purple-500"
    },
    {
      icon: Clock,
      title: "Le temps comme luxe",
      description: "Redéfinir le temps non comme une contrainte mais comme un cadeau précieux à s'offrir.",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "L'essentiel révélé",
      description: "Dans le partage d'énergie positive, l'essentiel émerge naturellement, authentiquement.",
      color: "text-amber-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Notre philosophie
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Nous croyons profondément que le bien-être authentique naît de la rencontre 
            entre l'introspection personnelle et la force du collectif.
          </p>
          
          <Button 
            onClick={() => navigate('/about')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Découvrir le parcours interactif
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start gap-4">
                  <div className={`${value.color} p-3 bg-white dark:bg-slate-700 rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-3xl max-w-4xl mx-auto">
            <p className="text-2xl font-light text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "Offrir à chacun une parenthèse, à chaque équipe une énergie partagée. 
              Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve 
              dans l'énergie partagée."
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
