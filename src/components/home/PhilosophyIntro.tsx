
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const PhilosophyIntro: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white/90 to-blue-50/30 dark:from-slate-900/90 dark:to-slate-800/30">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <Sparkles className="h-12 w-12 text-purple-500" />
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 font-light italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="font-medium">Bienvenue sur EmotionsCare.</span> Le bien-être ne s'explique pas, il se vit.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-lg border border-white/20"
          >
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Notre ambition : <span className="font-semibold text-purple-600 dark:text-purple-400">offrir à chacun une parenthèse pour soi, à chaque équipe une énergie partagée.</span>
            </p>
            
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Ici, le temps redevient un luxe accessible, et l'essentiel se retrouve dans l'énergie partagée.
            </p>
            
            <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300">
              Rejoignez-nous pour explorer une nouvelle vision du bien-être : 
              <span className="text-purple-600 dark:text-purple-400"> simple, essentielle, humaine, élégante.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophyIntro;
