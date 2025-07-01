
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Users, Activity } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const ReportsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Rapports & Analyses
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyses détaillées du bien-être organisationnel
            </p>
          </div>
          <div className="flex gap-4">
            <PremiumButton variant="secondary">
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </PremiumButton>
            <PremiumButton variant="primary">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </PremiumButton>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <PremiumCard className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-green-600">+15%</h3>
            <p className="text-muted-foreground">Amélioration ce mois</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-blue-600">78%</h3>
            <p className="text-muted-foreground">Participation</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-purple-600">4.2/5</h3>
            <p className="text-muted-foreground">Satisfaction</p>
          </PremiumCard>
          
          <PremiumCard className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold text-orange-600">87%</h3>
            <p className="text-muted-foreground">Score global</p>
          </PremiumCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique d'évolution */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Évolution du Bien-être</h3>
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique d'évolution temporelle</p>
            </div>
          </PremiumCard>

          {/* Répartition par équipe */}
          <PremiumCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Répartition par Équipe</h3>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Marketing</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Développement</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Service Client</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Rapports disponibles */}
        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Rapports Disponibles</h3>
            <Download className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border">
              <h4 className="font-bold mb-2">Rapport Mensuel</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Synthèse complète du mois écoulé
              </p>
              <PremiumButton variant="primary" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </PremiumButton>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border">
              <h4 className="font-bold mb-2">Analyse par Équipe</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Détail par équipe et manager
              </p>
              <PremiumButton variant="secondary" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </PremiumButton>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border">
              <h4 className="font-bold mb-2">Tendances Annuelles</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Évolution sur 12 mois
              </p>
              <PremiumButton variant="accent" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </PremiumButton>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
