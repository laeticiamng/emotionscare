
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain, TrendingUp, Lightbulb, Target, Users, Zap,
  CheckCircle, Clock, AlertTriangle, ArrowRight, Sparkles
} from 'lucide-react';
import { ImprovementSuggestion, FeedbackEntry } from '@/types/feedback';

interface ImprovementEngineProps {
  feedbacks: FeedbackEntry[];
  suggestions: ImprovementSuggestion[];
  onImplementSuggestion: (id: string) => void;
  onGenerateNewSuggestions: () => void;
}

const ImprovementEngine: React.FC<ImprovementEngineProps> = ({
  feedbacks,
  suggestions,
  onImplementSuggestion,
  onGenerateNewSuggestions
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const typeIcons = {
    feature: { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    ui_improvement: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
    workflow: { icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    performance: { icon: Zap, color: 'text-green-500', bg: 'bg-green-50' }
  };

  const effortConfig = {
    low: { label: 'Faible', color: 'bg-green-100 text-green-800', progress: 25 },
    medium: { label: 'Moyen', color: 'bg-yellow-100 text-yellow-800', progress: 50 },
    high: { label: 'Élevé', color: 'bg-red-100 text-red-800', progress: 75 }
  };

  const statusConfig = {
    generated: { label: 'Généré', color: 'bg-blue-100 text-blue-800', icon: Brain },
    reviewed: { label: 'Examiné', color: 'bg-purple-100 text-purple-800', icon: Users },
    approved: { label: 'Approuvé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    implemented: { label: 'Implémenté', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
  };

  // Analyse des tendances des feedbacks
  const analyzePattern = () => {
    const patterns = {
      mostReportedIssues: feedbacks
        .filter(f => f.type === 'bug')
        .reduce((acc, feedback) => {
          const key = feedback.module;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      
      mostRequestedFeatures: feedbacks
        .filter(f => f.type === 'feature_request')
        .slice(0, 5),
      
      averageRatingByModule: Object.entries(
        feedbacks.reduce((acc, f) => {
          if (!acc[f.module]) {
            acc[f.module] = { total: 0, count: 0 };
          }
          acc[f.module].total += f.rating;
          acc[f.module].count += 1;
          return acc;
        }, {} as Record<string, { total: number; count: number }>)
      ).map(([module, data]) => ({
        module,
        average: (data.total / data.count).toFixed(1)
      }))
    };

    return patterns;
  };

  const patterns = analyzePattern();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    onGenerateNewSuggestions();
    setIsAnalyzing(false);
  };

  const prioritizedSuggestions = suggestions.sort((a, b) => 
    (b.impact_score * b.confidence) - (a.impact_score * a.confidence)
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suggestions actives</p>
                <p className="text-2xl font-bold">{suggestions.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Implémentées</p>
                <p className="text-2xl font-bold">
                  {suggestions.filter(s => s.status === 'implemented').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Impact moyen</p>
                <p className="text-2xl font-bold">
                  {suggestions.length > 0 
                    ? (suggestions.reduce((acc, s) => acc + s.impact_score, 0) / suggestions.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confiance IA</p>
                <p className="text-2xl font-bold">
                  {suggestions.length > 0 
                    ? Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)
                    : 0
                  }%
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'analyse */}
      <div className="flex justify-center">
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isAnalyzing ? (
            <>
              <Brain className="h-5 w-5 mr-2 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Brain className="h-5 w-5 mr-2" />
              Analyser et générer des suggestions
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
          <TabsTrigger value="patterns">Analyse des tendances</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <AnimatePresence>
            {prioritizedSuggestions.map((suggestion, index) => {
              const typeConfig = typeIcons[suggestion.type];
              const StatusIcon = statusConfig[suggestion.status].icon;
              
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedSuggestion === suggestion.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedSuggestion(
                    selectedSuggestion === suggestion.id ? null : suggestion.id
                  )}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                            <typeConfig.icon className={`h-5 w-5 ${typeConfig.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={statusConfig[suggestion.status].color}>
                                {statusConfig[suggestion.status].label}
                              </Badge>
                              <Badge className={effortConfig[suggestion.effort_estimation].color}>
                                Effort: {effortConfig[suggestion.effort_estimation].label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Impact</div>
                          <div className="font-bold text-lg">{suggestion.impact_score}/10</div>
                          <div className="text-xs text-muted-foreground">
                            Confiance: {suggestion.confidence}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {selectedSuggestion === suggestion.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-muted-foreground">{suggestion.description}</p>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Raisonnement IA:</h4>
                                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Effort estimé</div>
                                    <Progress 
                                      value={effortConfig[suggestion.effort_estimation].progress} 
                                      className="w-20"
                                    />
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Basé sur {suggestion.feedback_ids.length} feedbacks
                                  </div>
                                </div>
                                
                                {suggestion.status !== 'implemented' && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onImplementSuggestion(suggestion.id);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Implémenter
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Problèmes les plus signalés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(patterns.mostReportedIssues)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([module, count]) => (
                      <div key={module} className="flex items-center justify-between">
                        <span className="font-medium">{module}</span>
                        <Badge variant="destructive">{count} signalements</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Notes moyennes par module
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patterns.averageRatingByModule
                    .sort((a, b) => parseFloat(a.average) - parseFloat(b.average))
                    .map(({ module, average }) => (
                      <div key={module} className="flex items-center justify-between">
                        <span className="font-medium">{module}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={parseFloat(average) * 20} className="w-16" />
                          <span className="text-sm font-bold">{average}/5</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-green-500" />
                Roadmap d'amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {prioritizedSuggestions.slice(0, 5).map((suggestion, index) => (
                  <div key={suggestion.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={effortConfig[suggestion.effort_estimation].color}>
                          {effortConfig[suggestion.effort_estimation].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Impact: {suggestion.impact_score}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImprovementEngine;
