
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, BarChart2, ArrowRight, Clock, Calendar, Users, TrendingUp, Settings } from 'lucide-react';

interface OptimizationArea {
  id: string;
  name: string;
  description: string;
  score: number;
  status: 'optimal' | 'warning' | 'critical';
  recommendations: string[];
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
}

const mockAreas: OptimizationArea[] = [
  {
    id: '1',
    name: 'Équilibre travail-repos',
    description: 'Mesure la balance entre les périodes de travail intense et les pauses récupératrices.',
    score: 68,
    status: 'warning',
    recommendations: [
      'Encourager les pauses régulières de 5-10 minutes toutes les heures',
      'Mettre en place des rappels de micro-pauses sur les postes de travail',
      'Créer des espaces détente facilement accessibles'
    ]
  },
  {
    id: '2',
    name: 'Gestion du stress',
    description: 'Analyse les niveaux de stress et les mécanismes de gestion en place.',
    score: 45,
    status: 'critical',
    recommendations: [
      'Organiser des ateliers de gestion du stress et de respiration',
      'Implémenter des moments de déconnexion digitale',
      'Proposer des séances guidées de relaxation sur la plateforme'
    ]
  },
  {
    id: '3',
    name: 'Communication d\'équipe',
    description: 'Évalue la qualité des interactions et de la communication entre collaborateurs.',
    score: 82,
    status: 'optimal',
    recommendations: [
      'Maintenir les rituels d\'équipe actuels',
      'Continuer à encourager les feedbacks constructifs',
      'Explorer de nouveaux formats d\'échange pour varier les interactions'
    ]
  },
  {
    id: '4',
    name: 'Charge cognitive',
    description: 'Mesure la pression mentale et la charge cognitive au cours de la journée.',
    score: 58,
    status: 'warning',
    recommendations: [
      'Revoir la planification des tâches complexes dans la journée',
      'Encourager la monotâche pour les activités à haute concentration',
      'Former les managers à mieux distribuer la charge mentale'
    ]
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Programme de micro-pauses organisées',
    description: 'Mise en place de rappels automatiques et d\'exercices guidés pour des pauses efficaces.',
    impact: 'high',
    effort: 'low',
    category: 'bien-être'
  },
  {
    id: '2',
    title: 'Ateliers de gestion du stress',
    description: 'Formation en groupe sur les techniques de respiration et de gestion du stress.',
    impact: 'high',
    effort: 'medium',
    category: 'formation'
  },
  {
    id: '3',
    title: 'Équipement ergonomique',
    description: 'Audit et mise à niveau des équipements pour améliorer le confort de travail.',
    impact: 'medium',
    effort: 'high',
    category: 'environnement'
  },
  {
    id: '4',
    title: 'Révision des processus de réunion',
    description: 'Optimisation de la durée et du format des réunions pour réduire la fatigue mentale.',
    impact: 'medium',
    effort: 'low',
    category: 'organisation'
  }
];

const OptimizationPage: React.FC = () => {
  const { toast } = useToast();
  const [areas, setAreas] = useState<OptimizationArea[]>(mockAreas);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  
  const handleImplementRecommendation = (areaId: string, recIndex: number) => {
    toast({
      title: "Recommandation en cours d'implémentation",
      description: "Cette fonctionnalité sera activée prochainement",
    });
  };
  
  const handleSetupOpportunity = (oppId: string) => {
    toast({
      title: "Configuration de l'opportunité",
      description: "Cette fonctionnalité sera disponible prochainement",
    });
  };
  
  const getStatusColor = (status: OptimizationArea['status']): string => {
    switch (status) {
      case 'optimal': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-gray-500';
    }
  };
  
  const getStatusIcon = (status: OptimizationArea['status']) => {
    switch (status) {
      case 'optimal': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default: return null;
    }
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  
  const getImpactBadge = (impact: Opportunity['impact']) => {
    const colors = {
      high: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[impact]}`}>
        Impact : {impact === 'high' ? 'Élevé' : impact === 'medium' ? 'Moyen' : 'Faible'}
      </span>
    );
  };
  
  const getEffortBadge = (effort: Opportunity['effort']) => {
    const colors = {
      high: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[effort]}`}>
        Effort : {effort === 'high' ? 'Élevé' : effort === 'medium' ? 'Moyen' : 'Faible'}
      </span>
    );
  };
  
  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'bien-être': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'formation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'environnement': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'organisation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };
  
  const totalScore = areas.reduce((sum, area) => sum + area.score, 0) / areas.length;
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Optimisation du bien-être</h1>
          <p className="text-muted-foreground">Améliorez le bien-être de vos équipes avec des recommandations ciblées</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => toast({
            title: "Rapports",
            description: "Les rapports détaillés seront disponibles prochainement"
          })}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Rapports
          </Button>
          <Button variant="outline" onClick={() => toast({
            title: "Paramètres",
            description: "Les paramètres d'optimisation seront disponibles prochainement"
          })}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Score global</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="currentColor"
                  className="text-muted opacity-20"
                  strokeWidth="10"
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="currentColor"
                  className={totalScore >= 75 ? "text-emerald-500" : (totalScore >= 50 ? "text-amber-500" : "text-rose-500")}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 45 * totalScore / 100} ${2 * Math.PI * 45}`}
                  strokeDashoffset={(2 * Math.PI * 45) / 4}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" className="text-2xl font-bold" dominantBaseline="middle" textAnchor="middle">
                  {Math.round(totalScore)}%
                </text>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {totalScore >= 75 
                ? "Excellent" 
                : (totalScore >= 50 
                  ? "Améliorations possibles" 
                  : "Nécessite attention")}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Prochaine analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">7 jours</p>
            <p className="text-sm text-muted-foreground">29 mai 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Événements à venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">3</p>
            <p className="text-sm text-muted-foreground">Prochains 30 jours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Équipes améliorées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">2/4</p>
            <p className="text-sm text-muted-foreground">Dernier trimestre</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="areas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="areas">Domaines d'optimisation</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="areas" className="space-y-4">
          {areas.map((area) => (
            <Card key={area.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {area.name}
                      <span className="ml-2">
                        {getStatusIcon(area.status)}
                      </span>
                    </CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </div>
                  <span className={`text-lg font-bold ${getStatusColor(area.status)}`}>
                    {area.score}%
                  </span>
                </div>
                <div className="mt-2">
                  <Progress
                    value={area.score}
                    className="h-2"
                    indicatorClassName={getScoreColor(area.score)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-2">Recommandations</h4>
                <ul className="space-y-2">
                  {area.recommendations.map((rec, index) => (
                    <li key={index} className="flex justify-between items-center border rounded-lg p-3">
                      <span>{rec}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleImplementRecommendation(area.id, index)}
                      >
                        Implémenter
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => toast({
                  title: "Détails de l'analyse",
                  description: "Le rapport détaillé sera disponible prochainement"
                })}>
                  Voir l'analyse complète
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <CardTitle>{opp.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getImpactBadge(opp.impact)}
                    {getEffortBadge(opp.effort)}
                    {getCategoryBadge(opp.category)}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{opp.description}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    onClick={() => handleSetupOpportunity(opp.id)}
                  >
                    Configurer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances d'amélioration</CardTitle>
              <CardDescription>Évolution des indicateurs de bien-être sur les derniers mois</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Les données de tendance seront disponibles après plusieurs cycles d'analyse.
                </p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => toast({
                    title: "Lancement d'analyse",
                    description: "L'analyse de tendance nécessite plus de données"
                  })}
                >
                  Lancer une nouvelle analyse
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptimizationPage;
