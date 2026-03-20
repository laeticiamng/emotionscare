/**
 * B2BPreventionProgramPage - Programme de prevention B2B
 * Module 18 : Parcours de prevention sur mesure pour les etablissements
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '@/hooks/usePageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Shield,
  Target,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Heart,
  Brain,
  AlertTriangle,
  BarChart3,
  FileText,
  Play,
  Sparkles,
  Loader2,
} from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PreventionProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  targetAudience: string;
  modules: string[];
  objectives: string[];
  status: 'active' | 'draft' | 'completed';
  progress: number;
  participants: number;
}

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'bg-emerald-500' },
  draft: { label: 'Brouillon', color: 'bg-amber-500' },
  completed: { label: 'Termine', color: 'bg-blue-500' },
};

export default function B2BPreventionProgramPage() {
  usePageSEO({
    title: 'Programme de prevention - EmotionsCare B2B',
    description: 'Creez et gerez des parcours de prevention sur mesure pour vos etablissements.',
    keywords: 'prevention, burn-out, bien-etre travail, programme RH, soignants',
  });

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('programs');

  const { data: programs = [], isLoading } = useQuery<PreventionProgram[]>({
    queryKey: ['prevention-programs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prevention_programs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data) return [];
      return data.map((row: any) => ({
        id: row.id,
        title: row.title ?? '',
        description: row.description ?? '',
        duration: row.duration ?? '',
        targetAudience: row.target_audience ?? '',
        modules: row.modules ?? [],
        objectives: row.objectives ?? [],
        status: row.status ?? 'draft',
        progress: row.progress ?? 0,
        participants: row.participants_count ?? 0,
      }));
    },
    enabled: !!user?.id,
  });

  const activePrograms = programs.filter(p => p.status === 'active');
  const totalParticipants = programs.reduce((sum, p) => sum + p.participants, 0);

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Link to="/app/rh" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard RH
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                B2B
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Programme de prevention
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Creez et deployez des parcours de prevention sur mesure pour vos equipes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{programs.length}</div>
                  <div className="text-xs text-muted-foreground">Programmes crees</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Play className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activePrograms.length}</div>
                  <div className="text-xs text-muted-foreground">Programmes actifs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalParticipants}</div>
                  <div className="text-xs text-muted-foreground">Participants actifs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {activePrograms.length > 0
                      ? `${Math.round(activePrograms.reduce((s, p) => s + p.progress, 0) / activePrograms.length)}%`
                      : '0%'}
                  </div>
                  <div className="text-xs text-muted-foreground">Progression moyenne</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="programs">Programmes</TabsTrigger>
                <TabsTrigger value="create">Creer</TabsTrigger>
                <TabsTrigger value="analytics">Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="space-y-4">
                {programs.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">Aucun programme. Creez votre premier programme de prevention.</p>
                  </Card>
                ) : (
                  programs.map((program) => (
                    <Card key={program.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg">{program.title}</CardTitle>
                              <Badge className={STATUS_CONFIG[program.status]?.color || 'bg-gray-500'}>
                                {STATUS_CONFIG[program.status]?.label || program.status}
                              </Badge>
                            </div>
                            <CardDescription>{program.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{program.participants} participants</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>{program.targetAudience}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Brain className="h-4 w-4" />
                            <span>{program.modules.length} modules</span>
                          </div>
                        </div>

                        {program.status === 'active' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progression globale</span>
                              <span className="font-medium">{program.progress}%</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                          </div>
                        )}

                        {program.modules.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Modules integres :</p>
                            <div className="flex flex-wrap gap-2">
                              {program.modules.map((mod, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{mod}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {program.objectives.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Objectifs :</p>
                            <div className="space-y-1">
                              {program.objectives.map((obj, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                  <span>{obj}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="create">
                <Card className="border-dashed border-2">
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Creer un nouveau programme</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Construisez un parcours de prevention en selectionnant les modules EmotionsCare.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        Demarrer la creation
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/contact">
                          <Heart className="h-4 w-4 mr-2" />
                          Demander un accompagnement
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Adoption par programme
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activePrograms.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Aucun programme actif</p>
                      ) : (
                        activePrograms.map((program) => (
                          <div key={program.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="truncate">{program.title}</span>
                              <span className="font-medium text-muted-foreground">{program.participants} pers.</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        Indicateurs d'impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Les indicateurs d'impact seront disponibles une fois les programmes actifs en cours.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Les donnees affichees sont des indicateurs agreges et anonymises conformement au RGPD.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageRoot>
  );
}
