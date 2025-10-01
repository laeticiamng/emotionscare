// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceMetric {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'warning' | 'critical';
  score: number;
  details: string;
}

const ComplianceWidget: React.FC = () => {
  const metrics: ComplianceMetric[] = [
    {
      id: '1',
      name: 'Chiffrement des données',
      description: 'Toutes les données sensibles sont chiffrées',
      status: 'compliant',
      score: 100,
      details: 'AES-256 en transit et au repos'
    },
    {
      id: '2',
      name: 'Gestion des accès',
      description: 'Contrôle d\'accès basé sur les rôles',
      status: 'compliant',
      score: 95,
      details: 'RLS activé sur toutes les tables'
    },
    {
      id: '3',
      name: 'Audit et journalisation',
      description: 'Traçabilité complète des actions',
      status: 'warning',
      score: 85,
      details: 'Rétention de 12 mois'
    },
    {
      id: '4',
      name: 'Droits RGPD',
      description: 'Export et suppression des données',
      status: 'compliant',
      score: 100,
      details: 'Conforme Article 20 RGPD'
    },
    {
      id: '5',
      name: 'Consentement utilisateur',
      description: 'Gestion granulaire du consentement',
      status: 'compliant',
      score: 90,
      details: 'Collecte explicite et révocable'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const overallScore = Math.round(metrics.reduce((acc, metric) => acc + metric.score, 0) / metrics.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Conformité sécurité
          </div>
          <Badge className="bg-green-100 text-green-800">
            Score: {overallScore}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  {getStatusIcon(metric.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">{metric.description}</div>
                    <div className="text-xs text-blue-600 mt-1">{metric.details}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {metric.score}%
                  </Badge>
                </div>
              </div>
              <Progress value={metric.score} className="h-2" />
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Score global de conformité</span>
            <span className="font-bold text-green-600">{overallScore}/100</span>
          </div>
          <Progress value={overallScore} className="h-3 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceWidget;
