import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, MessageCircle, Zap, Calendar, Target } from 'lucide-react';

interface DashboardStats {
  totalConversations: number;
  thisWeekConversations: number;
  averageMoodScore: number;
  lastInteraction: string;
  emotionTrend: Array<{ date: string; mood: number }>;
  emotionDistribution: Array<{ name: string; value: number }>;
  weeklyActivity: Array<{ day: string; count: number }>;
  flexibilityScore: number;
}

const EMOTION_COLORS = {
  joy: '#FBBF24',
  sadness: '#60A5FA',
  anxiety: '#F87171',
  calm: '#34D399',
  neutral: '#9CA3AF',
  anger: '#F97316',
};

export const CoachDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 24,
    thisWeekConversations: 5,
    averageMoodScore: 6.8,
    lastInteraction: 'Il y a 2h',
    emotionTrend: [
      { date: 'Lun', mood: 5 },
      { date: 'Mar', mood: 6 },
      { date: 'Mer', mood: 6.5 },
      { date: 'Jeu', mood: 7 },
      { date: 'Ven', mood: 7.5 },
      { date: 'Sam', mood: 8 },
      { date: 'Dim', mood: 6.8 },
    ],
    emotionDistribution: [
      { name: 'Calme', value: 35 },
      { name: 'Joyeux', value: 25 },
      { name: 'Neutre', value: 20 },
      { name: 'Anxieux', value: 15 },
      { name: 'Triste', value: 5 },
    ],
    weeklyActivity: [
      { day: 'Lun', count: 2 },
      { day: 'Mar', count: 3 },
      { day: 'Mer', count: 1 },
      { day: 'Jeu', count: 4 },
      { day: 'Ven', count: 3 },
      { day: 'Sam', count: 5 },
      { day: 'Dim', count: 2 },
    ],
    flexibilityScore: 72,
  });

  const getMoodColor = (score: number) => {
    if (score < 3) return 'text-red-500';
    if (score < 5) return 'text-orange-500';
    if (score < 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMoodLabel = (score: number) => {
    if (score < 3) return 'Difficile';
    if (score < 5) return 'Tendu';
    if (score < 7) return 'Acceptable';
    return 'Bien';
  };

  return (
    <div className="space-y-6 w-full">
      {/* En-tête avec salutation */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Bienvenue dans votre espace de bien-être 🌟
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Suivi de votre progression émotionnelle et interactions avec votre coach IA
        </p>
      </div>

      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bien-être actuel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Bien-être actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getMoodColor(stats.averageMoodScore)}`}>
              {stats.averageMoodScore.toFixed(1)}/10
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {getMoodLabel(stats.averageMoodScore)}
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                style={{ width: `${(stats.averageMoodScore / 10) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Total conversations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Total conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalConversations}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats.thisWeekConversations} cette semaine
            </p>
          </CardContent>
        </Card>

        {/* Flexibilité psychologique */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Flexibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.flexibilityScore}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selon AAQ-II
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${stats.flexibilityScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dernière interaction */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Dernière interaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.lastInteraction}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Restez connecté(e) 💬
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendance émotionnelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendance émotionnelle (7 jours)
            </CardTitle>
            <CardDescription>
              Évolution de votre bien-être au fil de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.emotionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis domain={[0, 10]} stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3B82F6"
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution des émotions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Distribution des états émotionnels
            </CardTitle>
            <CardDescription>
              Répartition de vos émotions au cours du mois
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.emotionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.emotionDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(EMOTION_COLORS)[index % 6]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activité hebdomadaire */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Votre activité cette semaine
            </CardTitle>
            <CardDescription>
              Nombre de conversations par jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F1F5F9',
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations personnalisées */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour aujourd'hui</CardTitle>
          <CardDescription>
            Basées sur votre tendance émotionnelle et votre historique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Respiration</h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                5 min de respiration guidée pour vous centrer
              </p>
              <Button className="mt-3 w-full h-8 text-sm" variant="outline" size="sm">
                Commencer
              </Button>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Journaling</h4>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-200">
                Exprimez vos pensées librement dans votre journal
              </p>
              <Button className="mt-3 w-full h-8 text-sm" variant="outline" size="sm">
                Écrire
              </Button>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h4 className="font-semibold text-green-900 dark:text-green-100">Musique</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-200">
                Découvrez une playlist adaptée à votre humeur
              </p>
              <Button className="mt-3 w-full h-8 text-sm" variant="outline" size="sm">
                Écouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Besoin de parler avec votre coach?</h3>
        <p className="text-sm mb-4 opacity-90">
          Lancez une nouvelle conversation pour recevoir des conseils personnalisés et du soutien émotionnel.
        </p>
        <Button className="bg-white text-blue-600 hover:bg-slate-100">
          Discuter avec Coach
        </Button>
      </div>
    </div>
  );
};
