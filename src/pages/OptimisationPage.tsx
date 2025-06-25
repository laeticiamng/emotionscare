
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Lightbulb, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OptimisationPage: React.FC = () => {
  const navigate = useNavigate();

  const optimizations = [
    {
      title: 'Étendre les pratiques de l\'équipe Développement',
      description: 'L\'équipe Dev a un excellent score de bien-être (8.1/10). Identifier et déployer leurs bonnes pratiques.',
      impact: 'high',
      effort: 'medium',
      status: 'recommended',
      benefits: ['Amélioration globale du bien-être', 'Réduction du stress', 'Meilleure productivité']
    },
    {
      title: 'Optimiser les horaires de méditation',
      description: 'Analyser les créneaux les plus fréquentés pour optimiser l\'offre de sessions.',
      impact: 'medium',
      effort: 'low',
      status: 'in_progress',
      benefits: ['Meilleure participation', 'Optimisation des ressources']
    },
    {
      title: 'Programme de mentorat inter-équipes',
      description: 'Créer des binômes entre équipes performantes et celles en difficulté.',
      impact: 'high',
      effort: 'high',
      status: 'planned',
      benefits: ['Transfert de connaissances', 'Cohésion d\'équipe', 'Amélioration continue']
    },
    {
      title: 'Personnalisation des recommandations IA',
      description: 'Améliorer l\'algorithme de recommandation basé sur les données comportementales.',
      impact: 'medium',
      effort: 'high',
      status: 'research',
      benefits: ['Recommandations plus pertinentes', 'Meilleur engagement']
    }
  ];

  const quickWins = [
    {
      title: 'Rappels de pause automatiques',
      description: 'Implémenter des notifications pour encourager les micro-pauses',
      timeToImplement: '1 semaine'
    },
    {
      title: 'Dashboard personnalisé',
      description: 'Permettre aux utilisateurs de personnaliser leur tableau de bord',
      timeToImplement: '2 semaines'
    },
    {
      title: 'Feedback instantané',
      description: 'Ajouter des enquêtes courtes après chaque session',
      timeToImplement: '1 semaine'
    }
  ];

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">Impact élevé</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Impact moyen</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Impact faible</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recommended':
        return <Badge className="bg-blue-100 text-blue-800">Recommandé</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-100 text-purple-800">En cours</Badge>;
      case 'planned':
        return <Badge className="bg-orange-100 text-orange-800">Planifié</Badge>;
      case 'research':
        return <Badge className="bg-gray-100 text-gray-800">En étude</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Optimisation continue</h1>
            <p className="text-gray-600">Améliorez en permanence le bien-être de votre organisation</p>
          </div>
          <Button onClick={() => navigate('/b2b/admin/dashboard')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>

        {/* Quick Wins */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Actions rapides (Quick Wins)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickWins.map((win, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold mb-2">{win.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{win.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{win.timeToImplement}</span>
                    <Button size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Implémenter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Opportunités d'optimisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {optimizations.map((opt, index) => (
                <div key={index} className="p-6 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{opt.title}</h3>
                        {getImpactBadge(opt.impact)}
                        {getStatusBadge(opt.status)}
                      </div>
                      <p className="text-gray-600 mb-4">{opt.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Bénéfices attendus :</h4>
                    <div className="flex flex-wrap gap-2">
                      {opt.benefits.map((benefit, bIndex) => (
                        <Badge key={bIndex} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Effort requis: <span className="font-medium">{opt.effort === 'high' ? 'Élevé' : opt.effort === 'medium' ? 'Moyen' : 'Faible'}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Analyser
                      </Button>
                      <Button size="sm">
                        Mettre en œuvre
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/teams')}>
                  Analyser les équipes
                </Button>
                <Button variant="outline" onClick={() => navigate('/reports')}>
                  Générer un rapport d'optimisation
                </Button>
                <Button variant="outline" onClick={() => navigate('/events')}>
                  Planifier une session d'amélioration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimisationPage;
