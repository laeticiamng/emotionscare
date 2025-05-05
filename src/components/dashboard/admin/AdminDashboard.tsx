
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, MessageSquare, Trophy, Sparkles, ShieldCheck, CalendarDays } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';
import { Activity } from 'lucide-react';
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Mock data for the dashboard
  const dashboardStats = {
    absenteeism: {
      current: 5.2,
      previous: 7.8,
      trend: -2.6,
      data: [4, 5, 7, 5, 6, 5, 4, 5, 3, 4, 5, 6, 5, 4, 3]
    },
    emotionalScore: {
      current: 78,
      previous: 72,
      trend: 6,
      data: [72, 71, 73, 74, 76, 77, 75, 78, 79, 78, 77, 78, 79, 80, 78]
    },
    productivity: {
      current: 92,
      previous: 87,
      trend: 5,
      data: [85, 86, 88, 87, 89, 90, 91, 92, 93, 92, 91, 92, 92, 93, 92]
    },
    journalEntries: [
      { date: '2024-05-01', avgScore: 76, checkIns: 42 },
      { date: '2024-05-02', avgScore: 78, checkIns: 38 },
      { date: '2024-05-03', avgScore: 75, checkIns: 45 },
      { date: '2024-05-04', avgScore: 79, checkIns: 40 },
      { date: '2024-05-05', avgScore: 80, checkIns: 37 }
    ]
  };

  // Mock data for social cocoon section
  const socialCocoonData = {
    totalPosts: 248,
    moderationRate: 3.2,
    activeUsers: 87,
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 },
      { tag: '#teamspirit', count: 28 },
      { tag: '#pausecafe', count: 22 }
    ]
  };

  // Mock data for gamification section
  const gamificationData = {
    activeUsersPercent: 68,
    totalBadges: 24,
    badgeLevels: [
      { level: 'Bronze', count: 14 },
      { level: 'Argent', count: 7 },
      { level: 'Or', count: 3 }
    ],
    topChallenges: [
      { name: 'Check-in quotidien', completions: 156 },
      { name: 'Partage d\'expérience', completions: 87 },
      { name: 'Lecture bien-être', completions: 63 }
    ]
  };

  // Mock RH action suggestions
  const rhSuggestions = [
    {
      title: "Atelier Respiration",
      description: "Session de 30 minutes sur techniques de respiration anti-stress.",
      icon: "🧘"
    },
    {
      title: "Pause café virtuelle",
      description: "Encourager les échanges entre services via breaks virtuels.",
      icon: "☕"
    },
    {
      title: "Challenge bien-être",
      description: "Lancer un défi quotidien de micro-pauses actives.",
      icon: "🏆"
    }
  ];

  // Mock events data
  const eventsData = [
    { date: '2025-05-10', title: 'Atelier Méditation', status: 'confirmed', attendees: 12 },
    { date: '2025-05-15', title: 'Webinar Gestion du Stress', status: 'pending', attendees: 25 },
    { date: '2025-05-20', title: 'Rétrospective Mensuelle', status: 'confirmed', attendees: 18 }
  ];

  // Mock compliance data
  const complianceData = {
    mfaEnabled: 92,
    lastKeyRotation: '2025-04-15',
    lastPentest: '2025-03-20',
    gdprCompliance: 'Complet',
    dataRetention: 'Conforme',
    certifications: ['ISO 27001', 'RGPD', 'HDS']
  };

  // Convert dashboard data to the format expected by components
  const absenteeismChartData = dashboardStats.absenteeism.data.map((value, index) => ({
    date: `${index+1}/5`,
    value
  }));
  
  const emotionalScoreTrend = dashboardStats.emotionalScore.data.map((value, index) => ({
    date: `${index+1}/5`,
    value
  }));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1B365D]">Dashboard Direction</h1>
        <p className="text-slate-600 italic">Pilotage & Bien-être Collectif</p>
      </div>

      {/* Tabs Navigation - Mise à jour selon les nouvelles catégories */}
      <Tabs defaultValue="vue-globale" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="vue-globale" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <BarChart2 className="mr-2 h-4 w-4" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="scan-team" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Activity className="mr-2 h-4 w-4" />
            Scan Émotionnel - Équipe
          </TabsTrigger>
          <TabsTrigger value="journal-trends" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <LineChart className="mr-2 h-4 w-4" />
            Journal - Tendances
          </TabsTrigger>
          <TabsTrigger value="social-cocoon" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <MessageSquare className="mr-2 h-4 w-4" />
            Social Cocoon
          </TabsTrigger>
          <TabsTrigger value="gamification" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Trophy className="mr-2 h-4 w-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="actions-rh" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Sparkles className="mr-2 h-4 w-4" />
            Actions RH
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <CalendarDays className="mr-2 h-4 w-4" />
            Événements
          </TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Conformité
          </TabsTrigger>
        </TabsList>

        <PeriodSelector timePeriod={selectedPeriod} setTimePeriod={setSelectedPeriod} />
        
        {/* Vue Globale Tab Content */}
        <TabsContent value="vue-globale" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Use updated props format based on component definitions */}
            <Card className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-[#1B365D]" />
                  Taux d'absentéisme
                </CardTitle>
                <CardDescription>
                  Évolution du taux d'absence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={absenteeismChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <EmotionalClimateCard emotionalScoreTrend={emotionalScoreTrend} />
            
            {/* KPI Summary Cards */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-white shadow-sm">
                <CardHeader className="pb-2 pt-1">
                  <CardTitle className="text-lg">Productivité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{dashboardStats.productivity.current}%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    ↑ +{dashboardStats.productivity.trend}% vs période précédente
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 bg-white shadow-sm">
                <CardHeader className="pb-2 pt-1">
                  <CardTitle className="text-lg">Score émotionnel moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">{dashboardStats.emotionalScore.current}/100</div>
                  <div className="text-sm text-green-600 flex items-center">
                    ↑ +{dashboardStats.emotionalScore.trend}% vs période précédente
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 bg-white shadow-sm">
                <CardHeader className="pb-2 pt-1">
                  <CardTitle className="text-lg">Engagement gamification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">{gamificationData.activeUsersPercent}%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    {gamificationData.totalBadges} badges distribués ce mois
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-xl text-sm text-muted-foreground">
              <p>Note RGPD: Données agrégées et anonymisées. Aucune information personnellement identifiable (PII) n'est utilisée.</p>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Scan Émotionnel - Équipe */}
        <TabsContent value="scan-team" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Score émotionnel de l'équipe</CardTitle>
                <CardDescription>Évolution du score moyen et des alertes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emotionalScoreTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 rounded-lg">
                    <h3 className="font-medium">Score moyen</h3>
                    <p className="text-2xl font-bold">{dashboardStats.emotionalScore.current}/100</p>
                  </Card>
                  <Card className="p-4 rounded-lg">
                    <h3 className="font-medium">Collaborateurs à risque</h3>
                    <p className="text-2xl font-bold text-amber-600">12%</p>
                  </Card>
                  <Card className="p-4 rounded-lg">
                    <h3 className="font-medium">Scans cette semaine</h3>
                    <p className="text-2xl font-bold">42</p>
                  </Card>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button variant="outline">Filtrer par service</Button>
                  <Button variant="outline">Filtrer par période</Button>
                  <Button variant="outline">Exporter les données</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Journal - Tendances */}
        <TabsContent value="journal-trends" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Répartition des humeurs</CardTitle>
                <CardDescription>Distribution anonymisée des états d'esprit</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <span className="text-5xl">😊</span>
                      </div>
                      <h4 className="font-medium">Positif</h4>
                      <p className="text-2xl font-bold text-green-600">62%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <span className="text-5xl">😐</span>
                      </div>
                      <h4 className="font-medium">Neutre</h4>
                      <p className="text-2xl font-bold text-blue-600">28%</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <span className="text-5xl">😔</span>
                      </div>
                      <h4 className="font-medium">Négatif</h4>
                      <p className="text-2xl font-bold text-amber-600">10%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Word Cloud des entrées journal</CardTitle>
                <CardDescription>Mots-clés les plus utilisés (anonymisés)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="bg-white/80 p-6 rounded-xl w-full h-full flex flex-wrap items-center justify-center gap-3">
                  {['bien-être', 'équipe', 'travail', 'stress', 'réunion', 'projet', 'deadline', 'pause', 
                    'satisfaction', 'accomplissement', 'challenge', 'communication', 'soutien', 'objectifs'].map((word, i) => (
                    <div 
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                      style={{ 
                        fontSize: `${Math.max(14, Math.min(24, 14 + Math.random() * 10))}px`,
                        opacity: 0.6 + (Math.random() * 0.4)
                      }}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Streaks moyens par service</CardTitle>
                <CardDescription>Nombre moyen de jours consécutifs avec entrées journal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Service</th>
                        <th className="text-left py-3 px-4">Streak moyen</th>
                        <th className="text-left py-3 px-4">Participation</th>
                        <th className="text-left py-3 px-4">Évolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">Marketing</td>
                        <td className="py-3 px-4">5.2 jours</td>
                        <td className="py-3 px-4">78%</td>
                        <td className="py-3 px-4 text-green-600">↑ +2.1%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">R&D</td>
                        <td className="py-3 px-4">4.8 jours</td>
                        <td className="py-3 px-4">72%</td>
                        <td className="py-3 px-4 text-green-600">↑ +1.2%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">Ventes</td>
                        <td className="py-3 px-4">3.5 jours</td>
                        <td className="py-3 px-4">65%</td>
                        <td className="py-3 px-4 text-amber-600">↓ -0.8%</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">Support</td>
                        <td className="py-3 px-4">4.1 jours</td>
                        <td className="py-3 px-4">70%</td>
                        <td className="py-3 px-4 text-green-600">↑ +1.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Social Cocoon Tab Content */}
        <TabsContent value="social-cocoon" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SocialCocoonCard socialStats={socialCocoonData} />
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Word Cloud des Hashtags</CardTitle>
                <CardDescription>Tendances des conversations anonymisées</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="bg-white/80 p-6 rounded-xl w-full h-full flex flex-wrap items-center justify-center gap-3">
                  {socialCocoonData.topHashtags.map((tag, i) => (
                    <div 
                      key={i}
                      className="px-3 py-1 rounded-full bg-cocoon-100 text-cocoon-800"
                      style={{ 
                        fontSize: `${Math.max(14, Math.min(24, 14 + tag.count / 4))}px`,
                        opacity: 0.6 + (tag.count / 100)
                      }}
                    >
                      {tag.tag}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Modération manuelle</CardTitle>
                <CardDescription>Posts nécessitant une revue (filtrés par l'IA)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Contenu</th>
                        <th className="text-left py-3 px-4">Raison</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">05/05/2025</td>
                        <td className="py-3 px-4">Message avec contenu sensible...</td>
                        <td className="py-3 px-4">Sensible - Santé mentale</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Approuver</Button>
                            <Button size="sm" variant="outline" className="text-red-500">Rejeter</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">04/05/2025</td>
                        <td className="py-3 px-4">Référence à une personne spécifique...</td>
                        <td className="py-3 px-4">Identité non anonymisée</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Approuver</Button>
                            <Button size="sm" variant="outline" className="text-red-500">Rejeter</Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-cocoon-500 hover:bg-cocoon-600 text-white">
                    Exporter rapport de modération
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Gamification Tab Content */}
        <TabsContent value="gamification" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GamificationSummaryCard gamificationStats={gamificationData} />
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Défis</CardTitle>
                <CardDescription>Les défis les plus réussis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gamificationData.topChallenges.map((challenge, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-pastel-green/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {i + 1}
                        </div>
                        <span>{challenge.name}</span>
                      </div>
                      <span className="font-medium">{challenge.completions} complétions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Distribution des badges</CardTitle>
                <CardDescription>Répartition des niveaux de badges obtenus</CardDescription>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <div className="bg-white/80 rounded-xl p-6 w-full h-full flex items-center justify-around">
                  {gamificationData.badgeLevels.map((level, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${
                          i === 0 ? 'bg-amber-100 text-amber-800' :
                          i === 1 ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <Trophy size={48} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{level.level}</p>
                        <p className="text-2xl font-bold">{level.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Actions & Solutions RH Tab Content */}
        <TabsContent value="actions-rh" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 md:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Suggestions IA</CardTitle>
                <CardDescription>Suggestions basées sur l'analyse des données</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rhSuggestions.map((suggestion, i) => (
                    <div key={i} className="bg-white/80 rounded-xl p-5 hover:shadow-md transition-all">
                      <div className="text-3xl mb-2">{suggestion.icon}</div>
                      <h3 className="font-semibold mb-2">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                      <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                        Mettre en place
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Proposer un Atelier</CardTitle>
                <CardDescription>Planifier une activité pour les équipes</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input type="text" className="w-full p-2 rounded border" placeholder="Nom de l'activité" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" className="w-full p-2 rounded border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea className="w-full p-2 rounded border h-24" placeholder="Décrivez l'activité..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget max</label>
                    <input type="number" className="w-full p-2 rounded border" placeholder="€" />
                  </div>
                  <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                    Proposer l'atelier
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Sondage Express</CardTitle>
                <CardDescription>Recueillir les avis de l'équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white/80 p-4 rounded-xl">
                    <p className="mb-4">Créez un sondage rapide pour prendre le pouls de vos équipes sur des sujets spécifiques.</p>
                    <div className="flex gap-2 mb-4">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Simple</div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Anonyme</div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Rapide</div>
                    </div>
                  </div>
                  <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                    Lancer un sondage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Events & Calendrier Tab Content */}
        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Événements planifiés</CardTitle>
                <CardDescription>Ateliers, sondages et challenges à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Événement</th>
                        <th className="text-left py-3 px-4">Statut</th>
                        <th className="text-left py-3 px-4">Participants</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsData.map((event, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 px-4">{new Date(event.date).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 px-4">{event.title}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              event.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {event.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{event.attendees}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Modifier</Button>
                              <Button size="sm" variant="outline">Annuler</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                    Nouvel événement
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
                <CardDescription>Vue mensuelle des événements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 text-center text-muted-foreground">
                  [Composant Calendrier avec événements]
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Événements récurrents</CardTitle>
                <CardDescription>Automatisation des événements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <h4 className="font-medium">Check-in hebdomadaire</h4>
                      <p className="text-sm text-muted-foreground">Tous les lundis à 10h</p>
                    </div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <h4 className="font-medium">Pause bien-être</h4>
                      <p className="text-sm text-muted-foreground">Tous les jours à 15h</p>
                    </div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <h4 className="font-medium">Bilan mensuel</h4>
                      <p className="text-sm text-muted-foreground">Dernier vendredi du mois</p>
                    </div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Conformité & Sécurité Tab Content */}
        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Statut de sécurité</CardTitle>
                <CardDescription>Synthèse des indicateurs clés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>MFA activée</span>
                    <span className="font-medium">{complianceData.mfaEnabled}% des utilisateurs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dernière rotation des clés</span>
                    <span className="font-medium">{new Date(complianceData.lastKeyRotation).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dernier test de pénétration</span>
                    <span className="font-medium">{new Date(complianceData.lastPentest).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conformité RGPD</span>
                    <span className="font-medium text-green-600">{complianceData.gdprCompliance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conservation des données</span>
                    <span className="font-medium text-green-600">{complianceData.dataRetention}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Standards de sécurité et conformité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {complianceData.certifications.map((cert, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl shadow-sm text-center">
                      <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium">{cert}</h4>
                      <p className="text-xs text-green-600">Certifié</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" variant="outline">
                    Voir tous les documents de certification
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>Journal d'audit</CardTitle>
                <CardDescription>Activités récentes sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Utilisateur</th>
                        <th className="text-left py-3 px-4">Action</th>
                        <th className="text-left py-3 px-4">Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">05/05/2025 09:32</td>
                        <td className="py-3 px-4">admin@example.com</td>
                        <td className="py-3 px-4">Connexion réussie</td>
                        <td className="py-3 px-4">IP: 192.168.1.1</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">04/05/2025 17:15</td>
                        <td className="py-3 px-4">john.doe@example.com</td>
                        <td className="py-3 px-4">Modification de rôle</td>
                        <td className="py-3 px-4">User → Manager</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4">03/05/2025 14:22</td>
                        <td className="py-3 px-4">admin@example.com</td>
                        <td className="py-3 px-4">Configuration MFA</td>
                        <td className="py-3 px-4">Activation pour tous</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                    Télécharger le rapport d'audit complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Données sécurisées avec chiffrement AES-256 • Conforme RGPD</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
