
import { motion } from 'framer-motion';
import { Heart, Brain, Music, BookOpen } from 'lucide-react';

const AccessSection = () => {
  const features = [
    {
      icon: <Brain className="h-12 w-12 text-white" />,
      title: "Analyse émotionnelle",
      description: "Notre technologie avancée analyse votre voix pour comprendre vos émotions et vous aider à les gérer efficacement.",
      gradient: "from-blue-500 via-blue-600 to-indigo-700"
    },
    {
      icon: <Music className="h-12 w-12 text-white" />,
      title: "Musique adaptative",
      description: "Écoutez des compositions musicales conçues pour répondre à votre état émotionnel et améliorer votre bien-être.",
      gradient: "from-purple-500 via-purple-600 to-pink-700"
    },
    {
      icon: <Heart className="h-12 w-12 text-white" />,
      title: "Suivi du bien-être",
      description: "Suivez l'évolution de votre état émotionnel au fil du temps et identifiez les tendances pour mieux vous comprendre.",
      gradient: "from-red-500 via-pink-600 to-rose-700"
    },
    {
      icon: <BookOpen className="h-12 w-12 text-white" />,
      title: "Journal émotionnel",
      description: "Tenez un journal de vos émotions et recevez des recommandations personnalisées pour améliorer votre quotidien.",
      gradient: "from-green-500 via-emerald-600 to-teal-700"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/5" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Fonctionnalités principales
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Découvrez comment notre plateforme révolutionnaire peut vous aider à mieux comprendre et gérer vos émotions au quotidien.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="premium-card group cursor-pointer"
            >
              <div className={`h-full bg-gradient-to-br ${feature.gradient} text-white p-8 rounded-2xl shadow-premium relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  <div className="mb-6 p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
