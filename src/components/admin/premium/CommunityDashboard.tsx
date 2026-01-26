import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useOpenAI } from '@/hooks/ai/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { useCommunityRecommendations } from '@/hooks/useCommunityRecommendations';
import { logger } from '@/lib/logger';

interface CommunityDashboardProps {
  isActive: boolean;
  onClick: () => void;
  visualStyle: 'minimal' | 'artistic';
  zenMode: boolean;
}

export const CommunityDashboard: React.FC<CommunityDashboardProps> = ({
  isActive,
  onClick,
  zenMode
}) => {
  useOpenAI();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { analyzeCommunityTrends } = useCommunityRecommendations();
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'moderation'>('overview');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  
  // Statistiques simulées pour la démonstration
  const stats = {
    users: {
      total: 487,
      active: 312,
      new: 24,
      growth: 8.2
    },
    content: {
      posts: 182,
      comments: 843,
      reactions: 2756
    },
    engagement: {
      rate: 76,
      avgPostsPerUser: 2.4,
      avgTimeSpent: 18.5
    },
    moderation: {
      flaggedContent: 7,
      resolvedIssues: 5,
      pendingReview: 2
    }
  };
  
  // Générer des insights avec OpenAI
  const generateInsights = async () => {
    setInsightsLoading(true);
    
    try {
      // Dans une implémentation réelle, nous utiliserions l'API OpenAI
      // const result = await admin.generateAnalytics(stats);
      
      // Pour la démonstration, nous simulons la réponse
      const trends = await analyzeCommunityTrends();
      
      setInsights({
        summary: "La communauté montre une croissance saine avec un taux d'engagement élevé de 76%. Les utilisateurs sont particulièrement actifs autour des sujets de méditation et de gestion du stress.",
        recommendations: [
          "Organiser un événement communautaire autour de la méditation",
          "Créer plus de contenu sur la gestion du stress",
          "Encourager les utilisateurs moins actifs via des défis personnalisés"
        ],
        emotionAnalysis: {
          dominant: "calm",
          secondary: "reflective",
          trend: "positive"
        },
        contentQuality: "high",
        userRetention: 88,
        ...trends
      });
      
      toast({
        title: "Analyse générée",
        description: "L'analyse communautaire a été mise à jour avec succès",
      });
    } catch (error) {
      logger.error("Erreur lors de la génération des insights", { error }, 'ADMIN');
      toast({
        title: "Erreur d'analyse",
        description: "Impossible de générer l'analyse communautaire",
        variant: "destructive"
      });
    } finally {
      setInsightsLoading(false);
    }
  };
  
  return (
    <Card 
      className={`overflow-hidden border transition-all ${isActive ? "shadow-md" : "shadow"} ${zenMode ? "bg-background/70 backdrop-blur-sm" : ""}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <span>Tableau de bord communautaire</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="moderation">Modération</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-background/70 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Utilisateurs</span>
                </div>
                <div className="text-2xl font-semibold">{stats.users.total}</div>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{stats.users.active} actifs</span>
                  <span className="text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.users.growth}%
                  </span>
                </div>
              </div>
              
              <div className="bg-background/70 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Contenu</span>
                </div>
                <div className="text-2xl font-semibold">{stats.content.posts + stats.content.comments}</div>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{stats.content.posts} publications</span>
                  <span>{stats.content.comments} commentaires</span>
                </div>
              </div>
              
              <div className="bg-background/70 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">Engagement</span>
                </div>
                <div className="text-2xl font-semibold">{stats.engagement.rate}%</div>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>{stats.engagement.avgPostsPerUser} posts/utilisateur</span>
                  <span>{stats.engagement.avgTimeSpent} min/session</span>
                </div>
              </div>
              
              <div className="bg-background/70 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span className="font-medium">Modération</span>
                </div>
                <div className="text-2xl font-semibold">{stats.moderation.pendingReview}</div>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span className="text-amber-500">{stats.moderation.flaggedContent} signalés</span>
                  <span className="text-green-500">{stats.moderation.resolvedIssues} résolus</span>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <Button 
                onClick={() => navigate('/app/community')}
                variant="outline"
                className="w-full"
              >
                Voir le tableau de bord complet
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="space-y-4">
              <Button
                onClick={generateInsights}
                disabled={insightsLoading}
                className="w-full"
              >
                {insightsLoading ? (
                  <>Génération en cours...</>
                ) : insights ? (
                  <>Rafraîchir l'analyse</>
                ) : (
                  <>Générer une analyse IA</>
                )}
              </Button>
              
              <AnimatePresence>
                {insights && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-3 rounded-lg border bg-card/50">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Résumé de l'analyse
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{insights.summary}</p>
                      
                      {insights.topTrends && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Tendances principales</h5>
                          <div className="flex flex-wrap gap-1">
                            {insights.topTrends.map((trend: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-primary/5">
                                {trend}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="text-sm font-medium mb-1">Recommandations</h5>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {insights.recommendations.slice(0, 2).map((rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
          
          <TabsContent value="moderation">
            <div className="space-y-3">
              {stats.moderation.pendingReview > 0 ? (
                <div className="p-3 rounded-lg border bg-card/50">
                  <h4 className="font-medium mb-2 flex items-center gap-1 text-amber-500">
                    <Clock className="h-4 w-4" />
                    Contenu en attente de modération
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="p-2 border rounded bg-background/50">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Publication #12479</span>
                        <Badge variant="outline" className="text-xs">il y a 32 min</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Contenu potentiellement inapproprié - vérification requise</p>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">Ignorer</Button>
                        <Button size="sm" variant="destructive">Modérer</Button>
                      </div>
                    </div>
                    
                    <div className="p-2 border rounded bg-background/50">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Commentaire #3856</span>
                        <Badge variant="outline" className="text-xs">il y a 1h</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">Signalé pour contenu hors sujet</p>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">Ignorer</Button>
                        <Button size="sm" variant="destructive">Modérer</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border bg-card/50 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium">Tout est à jour</h4>
                  <p className="text-sm text-muted-foreground">Aucun contenu en attente de modération</p>
                </div>
              )}
              
              <Button 
                onClick={() => navigate('/app/community')}
                variant="outline"
                className="w-full"
              >
                Voir tous les rapports
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityDashboard;
