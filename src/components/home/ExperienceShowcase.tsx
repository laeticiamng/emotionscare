
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Music, 
  MessageCircle, 
  Activity,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  Heart,
  Target
} from 'lucide-react';

const ExperienceShowcase: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const experiences = [
    {
      category: "Particuliers",
      title: "Votre parenthèse personnelle",
      description: "Un espace intime où vous reconnecter à l'essentiel",
      features: [
        {
          icon: Brain,
          name: "Scanner Émotionnel",
          description: "Analysez vos émotions via texte, audio ou émojis",
          color: "from-blue-400 to-cyan-400"
        },
        {
          icon: Music,
          name: "Musique Thérapeutique",
          description: "Compositions adaptées à votre état émotionnel",
          color: "from-purple-400 to-pink-400"
        },
        {
          icon: MessageCircle,
          name: "Coach Personnel IA",
          description: "Accompagnement sur mesure 24h/24",
          color: "from-green-400 to-emerald-400"
        }
      ],
      cta: {
        text: "Commencer gratuitement",
        action: () => navigate('/signup'),
        variant: "default" as const
      }
    },
    {
      category: "Entreprises",
      title: "L'énergie partagée de vos équipes",
      description: "Cultivez le bien-être collectif et renforcez la cohésion",
      features: [
        {
          icon: Users,
          name: "Dashboard RH",
          description: "Pilotez le bien-être de votre organisation",
          color: "from-slate-400 to-slate-600"
        },
        {
          icon: BarChart3,
          name: "Analytics Avancées",
          description: "Insights détaillés sur l'engagement des équipes",
          color: "from-indigo-400 to-blue-400"
        },
        {
          icon: Target,
          name: "Programmes Collectifs",
          description: "Challenges et activités de team building",
          color: "from-orange-400 to-red-400"
        }
      ],
      cta: {
        text: "Découvrir l'offre entreprise",
        action: () => navigate('/entreprise'),
        variant: "outline" as const
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Expériences sur mesure
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Deux univers, une même vision
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Que vous soyez particulier en quête d'équilibre ou entreprise soucieuse du bien-être 
            de vos collaborateurs, nous adaptons notre approche à vos besoins uniques.
          </p>
        </motion.div>

        {/* Experiences Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {experiences.map((experience, index) => (
            <motion.div key={experience.category} variants={itemVariants}>
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8">
                  {/* Category Badge */}
                  <Badge 
                    variant={index === 0 ? "default" : "secondary"} 
                    className={`mb-6 ${index === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-slate-600'}`}
                  >
                    {experience.category}
                  </Badge>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-6 mb-8">
                    {experience.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + (index * 0.2) + (featureIndex * 0.1) }}
                        className="flex items-start space-x-4 group/feature"
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover/feature:scale-110 transition-transform duration-300`}>
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover/feature:text-blue-600 dark:group-hover/feature:text-blue-400 transition-colors">
                            {feature.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.2) }}
                  >
                    <Button
                      onClick={experience.cta.action}
                      variant={experience.cta.variant}
                      className={`w-full group/cta ${
                        experience.cta.variant === 'default' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                      }`}
                    >
                      {experience.cta.text}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/cta:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl max-w-4xl mx-auto border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
              <Sparkles className="h-6 w-6 text-purple-600" />
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Prêt à transformer votre relation au bien-être ?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Rejoignez dès aujourd'hui une communauté qui place l'humain au cœur de l'innovation technologique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/mode-selection')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Activity className="h-4 w-4 mr-2" />
                Découvrir gratuitement
              </Button>
              <Button 
                onClick={() => navigate('/entreprise')}
                variant="outline"
                className="border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Solutions entreprise
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceShowcase;
