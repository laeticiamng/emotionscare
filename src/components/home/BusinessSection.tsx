
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Hospital, Users, Heart, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BusinessSection: React.FC = () => {
  const navigate = useNavigate();

  const clients = [
    {
      icon: GraduationCap,
      title: "Facultés de médecine",
      description: "Soutien émotionnel pour les étudiants, accompagnement durant les années intenses de formation."
    },
    {
      icon: Hospital,
      title: "Hôpitaux & cliniques",
      description: "Prévention du burn-out, récupération post-garde, qualité de vie au travail."
    },
    {
      icon: Users,
      title: "EHPAD & soins à domicile",
      description: "Soutenir les équipes face à la charge émotionnelle du care au quotidien."
    },
    {
      icon: Heart,
      title: "Centres de santé",
      description: "Préserver l'énergie des équipes pour qu'elles puissent mieux prendre soin."
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Prévention du burn-out",
      stat: "-45%",
      description: "Réduction des arrêts maladie liés à l'épuisement"
    },
    {
      icon: TrendingUp,
      title: "Engagement équipes",
      stat: "+60%",
      description: "Amélioration du bien-être ressenti"
    },
    {
      icon: Heart,
      title: "Qualité du soin",
      stat: "+35%",
      description: "Meilleure relation soignant-patient"
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
            Pour les organisations de santé
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold">Vos soignants sont votre ressource la plus précieuse.</span>
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Leur équilibre émotionnel impacte directement la qualité du soin, la cohésion d'équipe et la rétention des talents.
            </p>
            <p className="text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 leading-relaxed">
              EmotionsCare : la solution de prévention de l'épuisement professionnel conçue pour le secteur santé.
            </p>
          </div>
        </motion.div>

        {/* Types de clients */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-slate-800 dark:text-white">
            Qui nous accompagnons
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {clients.map((client, index) => (
              <motion.div
                key={client.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <client.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                      {client.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {client.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Résultats chiffrés */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-slate-800 dark:text-white">
            Impact mesurable
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-3xl"
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {benefit.stat}
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 md:p-10 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-800 dark:text-white">
              Protégez ceux qui protègent les autres
            </h3>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
              Licence collective, déploiement accompagné, tableau de bord anonymisé.
            </p>
            <Button
              onClick={() => navigate('/login?segment=b2b')}
              size="lg"
              className="group px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Demander une démo
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessSection;
