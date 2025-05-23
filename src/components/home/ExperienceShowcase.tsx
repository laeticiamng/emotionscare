
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, Users2, Building2, ArrowRight, Sparkles } from 'lucide-react';

const ExperienceShowcase: React.FC = () => {
  const navigate = useNavigate();

  const experiences = [
    {
      icon: User,
      title: "Particulier",
      subtitle: "Votre parenthèse personnelle",
      description: "Créez votre espace de sérénité avec un accompagnement personnalisé adapté à votre rythme de vie.",
      features: ["Scanner émotionnel IA", "Coach personnel", "Musique thérapeutique", "Journal intime"],
      cta: "Commencer ma parenthèse",
      route: "/b2c/login",
      gradient: "from-pink-500 to-purple-600",
      bgGradient: "from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20"
    },
    {
      icon: Users2,
      title: "Collaborateur",
      subtitle: "L'énergie partagée au travail",
      description: "Cultivez le bien-être collectif avec des outils pensés pour l'harmonie des équipes.",
      features: ["Scan d'équipe", "Activités collaboratives", "Challenges bien-être", "Suivi d'ambiance"],
      cta: "Rejoindre mon équipe",
      route: "/b2b/user/login",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      icon: Building2,
      title: "Administration RH",
      subtitle: "Pilotez l'énergie collective",
      description: "Analysez et cultivez le bien-être de vos équipes avec des insights précis et actionables.",
      features: ["Tableaux de bord RH", "Analytics d'équipe", "Gestion des utilisateurs", "Rapports détaillés"],
      cta: "Accéder au pilotage",
      route: "/b2b/admin/login",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <span className="text-purple-600 font-medium">Trois expériences, une même vision</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
            Choisissez votre chemin vers le bien-être
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Que vous soyez un individu en quête de sérénité, un collaborateur souhaitant partager 
            une énergie positive, ou un responsable RH voulant cultiver le bien-être collectif.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className={`h-full bg-gradient-to-br ${exp.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2`}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${exp.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <exp.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                      {exp.title}
                    </h3>
                    <p className={`text-sm font-medium bg-gradient-to-r ${exp.gradient} bg-clip-text text-transparent`}>
                      {exp.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
                    {exp.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {exp.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className={`w-2 h-2 bg-gradient-to-r ${exp.gradient} rounded-full`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate(exp.route)}
                    className={`w-full bg-gradient-to-r ${exp.gradient} hover:opacity-90 text-white font-medium py-3 rounded-xl group/btn`}
                  >
                    {exp.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            onClick={() => navigate('/choose-mode')}
            variant="outline"
            size="lg"
            className="border-2 border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-full"
          >
            Explorer toutes les options
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceShowcase;
