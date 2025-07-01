
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const OptimisationPage: React.FC = () => {
  const recommendations = [
    {
      type: "success",
      title: "Excellent engagement",
      description: "L'équipe Marketing montre un excellent taux d'engagement (+15%)",
      action: "Continuer sur cette voie",
      priority: "Faible"
    },
    {
      type: "warning", 
      title: "Attention nécessaire",
      description: "L'équipe Dev montre des signes de stress accru cette semaine",
      action: "Organiser une session de détente",
      priority: "Moyenne"
    },
    {
      type: "critical",
      title: "Action requise",
      description: "Baisse de participation aux activités bien-être (-20%)",
      action: "Revoir la stratégie d'engagement", 
      priority: "Haute"
    }
  ];

  const optimizationTips = [
    "Programmer des sessions courtes de 10-15 minutes pour maximiser la participation",
    "Varier les types d'activités pour maintenir l'intérêt des équipes",
    "Utiliser les données de feedback pour personnaliser les recommandations",
    "Créer des challenges inter-équipes pour stimuler l'engagement"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Optimisation & Recommandations
          </h1>
          <p className="text-lg text-muted-foreground">
            Améliorez continuellement le bien-être de vos équipes grâce à l'IA
          </p>
        </div>

        {/* Métriques d'optimisation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <PremiumCard className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">+12%</h3>
            <p className="text-muted-foreground">Amélioration globale</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-blue-600">8/10</h3>
            <p className="text-muted-foreground">Recommandations appliquées</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold text-orange-600">3</h3>
            <p className="text-muted-foreground">Actions prioritaires</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-purple-600">94%</h3>
            <p className="text-muted-foreground">Score d'optimisation</p>
          </PremiumCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recommandations IA */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Recommandations IA</h3>
              <Lightbulb className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.type === 'success' ? 'bg-green-50 border-green-500' :
                    rec.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold">{rec.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      rec.priority === 'Faible' ? 'bg-green-100 text-green-800' :
                      rec.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{rec.action}</span>
                    <PremiumButton variant="ghost" size="sm">
                      Appliquer
                    </PremiumButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>

          {/* Conseils d'optimisation */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Conseils d'Optimisation</h3>
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {optimizationTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <PremiumButton variant="primary">
                Générer de nouveaux conseils
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>

        {/* Tableau de bord d'optimisation */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Tableau de Bord d'Optimisation</h3>
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="font-bold mb-2">Performance Globale</h4>
              <div className="text-2xl font-bold text-green-600 mb-2">Excellente</div>
              <p className="text-sm text-muted-foreground">
                Toutes les métriques sont dans le vert
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold mb-2">Objectifs Atteints</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">7/10</div>
              <p className="text-sm text-muted-foreground">
                Très bon taux de réalisation
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-bold mb-2">Potentiel d'Amélioration</h4>
              <div className="text-2xl font-bold text-purple-600 mb-2">18%</div>
              <p className="text-sm text-muted-foreground">
                Marge de progression identifiée
              </p>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default OptimisationPage;
