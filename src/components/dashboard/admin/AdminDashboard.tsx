
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchReports, fetchUsersAvgScore, fetchUsersWithStatus, fetchJournalStats, fetchSocialActivityStats, fetchGamificationStats } from '@/lib/dashboardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineItem, TimelineHeader, TimelineIcon, TimelineTitle, TimelineContent, TimelineBody } from "@/components/ui/timeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CalendarDays, MessageSquare, Trophy, Users, Plus, Bell, ChartBar, Activity, Award } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';
import LoadingAnimation from '@/components/ui/loading-animation';
import CountUp from 'react-countup';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [emotionalScoreTrend, setEmotionalScoreTrend] = useState<Array<{ date: string; value: number }>>([]);
  const [journalStats, setJournalStats] = useState<Array<{ date: string; score: number; count: number }>>([]);
  const [socialStats, setSocialStats] = useState<{
    totalPosts: number;
    moderationRate: number;
    topHashtags: Array<{ tag: string; count: number }>
  }>({
    totalPosts: 126,
    moderationRate: 5,
    topHashtags: [
      { tag: "#bienetre", count: 28 },
      { tag: "#teamspirit", count: 21 },
      { tag: "#détente", count: 18 },
      { tag: "#santé", count: 14 },
      { tag: "#équipe", count: 12 },
      { tag: "#motivation", count: 10 }
    ]
  });
  const [gamificationStats, setGamificationStats] = useState<{
    activeUsersPercent: number;
    totalBadges: number;
  }>({
    activeUsersPercent: 68,
    totalBadges: 24
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');
  const [activeTab, setActiveTab] = useState<string>("global");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
        
        // Load emotional score trend
        const avgScoreData = await fetchUsersAvgScore(parseInt(timePeriod));
        setEmotionalScoreTrend(avgScoreData);
        
        // Load journal stats
        const journalData = await fetchJournalStats(parseInt(timePeriod));
        setJournalStats(journalData);
        
        // Load social stats
        const socialData = await fetchSocialActivityStats();
        setSocialStats(socialData);
        
        // Load gamification stats
        const gamificationData = await fetchGamificationStats();
        setGamificationStats(gamificationData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section with Period Selector */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">Dashboard Direction</h1>
            <h2 className="text-xl text-muted-foreground mt-2 italic font-light">
              Pilotage & Bien-être Collectif
            </h2>
          </div>
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
      
      {/* Tab Navigation */}
      <Tabs defaultValue="global" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="global" className="data-[state=active]:bg-[#1B365D] data-[state=active]:text-white">
            <Activity className="mr-2 h-4 w-4" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-[#1B365D] data-[state=active]:text-white">
            <MessageSquare className="mr-2 h-4 w-4" />
            Social Cocoon
          </TabsTrigger>
          <TabsTrigger value="gamification" className="data-[state=active]:bg-[#1B365D] data-[state=active]:text-white">
            <Trophy className="mr-2 h-4 w-4" />
            Synthèse Gamification
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-[#1B365D] data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" />
            Actions & Solutions RH
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <LoadingAnimation text="Chargement des données anonymisées..." />
        ) : (
          <>
            {/* Vue Globale Tab */}
            <TabsContent value="global" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Charts Section */}
                <AdminChartSection 
                  absenteeismData={absenteeismData} 
                  productivityData={productivityData}
                />
                
                {/* Emotional Climate Overview */}
                <EmotionalClimateCard emotionalScoreTrend={emotionalScoreTrend} />
                
                {/* Journal de bord global */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="text-[#1B365D]" />
                      Journal de bord global
                    </CardTitle>
                    <CardDescription>
                      Timeline anonymisée des check-ins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto pr-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Score moyen</TableHead>
                            <TableHead>Nombre de check-ins</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {journalStats.map((entry, index) => (
                            <TableRow key={index} className="hover:bg-muted/30">
                              <TableCell>{entry.date}</TableCell>
                              <TableCell>{entry.score.toFixed(1)}/100</TableCell>
                              <TableCell>{entry.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                {/* RGPD Note */}
                <div className="col-span-1 lg:col-span-2 text-center text-sm text-muted-foreground">
                  <p>Données agrégées et anonymisées. Aucune information personnelle identifiable (PII) n'est affichée.</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Social Cocoon Tab */}
            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Social Cocoon Analytics */}
                <SocialCocoonCard socialStats={socialStats} />
                
                {/* Word Cloud Card */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="text-[#1B365D]" />
                      Tendances Hashtags
                    </CardTitle>
                    <CardDescription>
                      Nuage de tags populaires (anonymisé)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="flex flex-wrap gap-3 justify-center">
                        {socialStats.topHashtags.map((tag, index) => (
                          <div 
                            key={index}
                            className="px-4 py-2 rounded-full"
                            style={{
                              fontSize: `${Math.max(0.8, 0.8 + (tag.count / 10) * 0.3)}rem`,
                              backgroundColor: `rgba(${255 - index * 20}, ${111 + index * 10}, ${97 + index * 15}, ${0.1 + index * 0.05})`,
                              color: `rgb(${70 + index * 10}, ${90 + index * 5}, ${110 - index * 5})`,
                              transform: `rotate(${Math.random() * 10 - 5}deg)`
                            }}
                          >
                            {tag.tag} <span className="opacity-60">({tag.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Widget "Publier" */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="text-[#1B365D]" />
                      Publier une annonce
                    </CardTitle>
                    <CardDescription>
                      Message accessible à tous les collaborateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <textarea 
                        className="w-full h-32 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                        placeholder="Rédigez votre annonce pour l'équipe..."
                      ></textarea>
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Template Reconnaissance</Button>
                          <Button variant="outline" size="sm">Template Humour</Button>
                        </div>
                        <Button variant="coral">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Envoyer l'annonce
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Gamification Tab */}
            <TabsContent value="gamification" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gamification Summary */}
                <GamificationSummaryCard gamificationStats={gamificationStats} />
                
                {/* Top Challenges */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="text-[#1B365D]" />
                      Top Défis Complétés
                    </CardTitle>
                    <CardDescription>
                      Les défis les plus populaires parmi les collaborateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">1</div>
                          <span className="font-medium">Check-in quotidien</span>
                        </div>
                        <span className="text-muted-foreground">68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">2</div>
                          <span className="font-medium">Journal de bord</span>
                        </div>
                        <span className="text-muted-foreground">42%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">3</div>
                          <span className="font-medium">Respiration guidée</span>
                        </div>
                        <span className="text-muted-foreground">37%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Badge Distribution */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="text-[#1B365D]" />
                      Distribution des Badges
                    </CardTitle>
                    <CardDescription>
                      Répartition des niveaux de badges obtenus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="relative h-48 w-48">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-amber-300 border-r-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                        <div className="absolute inset-0 rounded-full border-8 border-blue-300 border-r-transparent border-b-transparent" style={{ transform: 'rotate(45deg)' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{gamificationStats.totalBadges}</div>
                            <div className="text-sm text-muted-foreground">badges totaux</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-300"></div>
                          <span>Niveau bronze (62%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                          <span>Niveau argent (28%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-300"></div>
                          <span>Niveau or (10%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Actions & Solutions RH Tab */}
            <TabsContent value="actions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bloc "Propositions IA" */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="text-[#1B365D]" />
                      Propositions IA
                    </CardTitle>
                    <CardDescription>
                      Suggestions basées sur les données anonymisées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Atelier Respiration</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                          <p className="mb-4">Un atelier de 30 minutes pour réduire le stress et favoriser la concentration.</p>
                          <Button size="sm" variant="coral" className="w-full">Mettre en place</Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Challenge Team Building</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                          <p className="mb-4">Créer des équipes mixtes pour un défi collaboratif hebdomadaire.</p>
                          <Button size="sm" variant="coral" className="w-full">Mettre en place</Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Pause Collective</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                          <p className="mb-4">Instaurer 15 min de pause synchronisée à 15h30 pour tous les services.</p>
                          <Button size="sm" variant="coral" className="w-full">Mettre en place</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Formulaire "Proposer un Atelier" */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="text-[#1B365D]" />
                      Proposer un Atelier
                    </CardTitle>
                    <CardDescription>
                      Créer un nouvel événement bien-être
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">Titre</label>
                        <input 
                          type="text" 
                          id="title" 
                          className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          placeholder="Ex: Atelier Yoga"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                          <input 
                            type="date" 
                            id="date" 
                            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label htmlFor="budget" className="block text-sm font-medium mb-1">Budget max</label>
                          <input 
                            type="number" 
                            id="budget" 
                            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                            placeholder="€"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                          id="description" 
                          className="w-full h-24 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          placeholder="Détaillez l'atelier..."
                        />
                      </div>
                      <Button variant="coral" className="w-full">Soumettre l'atelier</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Formulaire "Planifier Réunion Bien-Être" */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="text-[#1B365D]" />
                      Planifier Réunion Bien-Être
                    </CardTitle>
                    <CardDescription>
                      Organiser une rencontre avec l'équipe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="meeting-date" className="block text-sm font-medium mb-1">Date</label>
                          <input 
                            type="date" 
                            id="meeting-date" 
                            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label htmlFor="meeting-time" className="block text-sm font-medium mb-1">Heure</label>
                          <input 
                            type="time" 
                            id="meeting-time" 
                            className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="meeting-invite" className="block text-sm font-medium mb-1">Message d'invitation</label>
                        <textarea 
                          id="meeting-invite" 
                          className="w-full h-24 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:outline-none" 
                          placeholder="Votre message d'invitation..."
                        />
                      </div>
                      <Button variant="coral" className="w-full">Planifier la réunion</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Sondage Express */}
                <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartBar className="text-[#1B365D]" />
                      Sondage Express
                    </CardTitle>
                    <CardDescription>
                      Recueillir le feedback des collaborateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="mb-6">Lancez rapidement un sondage pour mesurer le ressenti de vos équipes sur un sujet précis.</p>
                      <Button variant="coral" className="px-8">
                        <Bell className="mr-2 h-4 w-4" />
                        Lancer un sondage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <DashboardFooter isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
