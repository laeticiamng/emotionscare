import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  date: string;
  messages: number;
  emotions: { joy: number; sadness: number; anxiety: number; calm: number };
  engagement: number;
  sessionDuration: number;
}

const SAMPLE_DATA: AnalyticsData[] = [
  { date: 'Nov 9', messages: 12, emotions: { joy: 7, sadness: 2, anxiety: 3, calm: 8 }, engagement: 75, sessionDuration: 23 },
  { date: 'Nov 10', messages: 8, emotions: { joy: 5, sadness: 3, anxiety: 4, calm: 6 }, engagement: 60, sessionDuration: 18 },
  { date: 'Nov 11', messages: 15, emotions: { joy: 8, sadness: 1, anxiety: 2, calm: 9 }, engagement: 85, sessionDuration: 31 },
  { date: 'Nov 12', messages: 10, emotions: { joy: 6, sadness: 2, anxiety: 3, calm: 7 }, engagement: 70, sessionDuration: 20 },
  { date: 'Nov 13', messages: 18, emotions: { joy: 9, sadness: 1, anxiety: 1, calm: 10 }, engagement: 95, sessionDuration: 38 },
  { date: 'Nov 14', messages: 11, emotions: { joy: 7, sadness: 2, anxiety: 2, calm: 8 }, engagement: 72, sessionDuration: 22 },
  { date: 'Nov 15', messages: 14, emotions: { joy: 8, sadness: 1, anxiety: 2, calm: 9 }, engagement: 82, sessionDuration: 28 },
];

interface ConversationQuality {
  id: string;
  title: string;
  messageCount: number;
  averageEmotionalScore: number;
  engagementLevel: number;
  duration: number;
}

const CONVERSATION_QUALITY: ConversationQuality[] = [
  { id: '1', title: 'Discussion sur anxiété', messageCount: 24, averageEmotionalScore: 5.2, engagementLevel: 85, duration: 42 },
  { id: '2', title: 'Conseil bien-être', messageCount: 18, averageEmotionalScore: 7.8, engagementLevel: 72, duration: 31 },
  { id: '3', title: 'Gestion stress', messageCount: 31, averageEmotionalScore: 6.1, engagementLevel: 92, duration: 52 },
  { id: '4', title: 'Joie et gratitude', messageCount: 14, averageEmotionalScore: 8.5, engagementLevel: 88, duration: 25 },
  { id: '5', title: 'Relations', messageCount: 22, averageEmotionalScore: 6.9, engagementLevel: 78, duration: 38 },
];

export const CoachAdvancedAnalytics = () => {
  const avgMessages = Math.round(SAMPLE_DATA.reduce((sum, d) => sum + d.messages, 0) / SAMPLE_DATA.length);
  const avgEngagement = Math.round(SAMPLE_DATA.reduce((sum, d) => sum + d.engagement, 0) / SAMPLE_DATA.length);
  const totalSessionMinutes = SAMPLE_DATA.reduce((sum, d) => sum + d.sessionDuration, 0);

  const bestConversation = CONVERSATION_QUALITY.reduce((prev, current) =>
    current.averageEmotionalScore > prev.averageEmotionalScore ? current : prev
  );

  const worstConversation = CONVERSATION_QUALITY.reduce((prev, current) =>
    current.averageEmotionalScore < prev.averageEmotionalScore ? current : prev
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Analytics Avancées 📊
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Analyse détaillée de vos interactions et de votre progression
        </p>
      </div>

      {/* KPIs Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Messages par jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{avgMessages}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Moyenne sur 7 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{avgEngagement}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Niveau moyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Temps total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{Math.round(totalSessionMinutes / 60)}h</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalSessionMinutes} minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{CONVERSATION_QUALITY.length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Total analysées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique messages et engagement */}
      <Card>
        <CardHeader>
          <CardTitle>Activité et Engagement (7 jours)</CardTitle>
          <CardDescription>Messages vs Engagement level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={SAMPLE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis yAxisId="left" stroke="#64748B" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="messages"
                stroke="#3B82F6"
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Messages"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                dot={{ fill: '#10B981', r: 4 }}
                name="Engagement (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Durée des sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Durée des Sessions</CardTitle>
          <CardDescription>Minutes par jour</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={SAMPLE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                }}
              />
              <Bar dataKey="sessionDuration" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Qualité des conversations */}
      <Card>
        <CardHeader>
          <CardTitle>Qualité des Conversations</CardTitle>
          <CardDescription>Score émotionnel vs Engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="engagementLevel" type="number" stroke="#64748B" name="Engagement %" />
              <YAxis dataKey="averageEmotionalScore" type="number" stroke="#64748B" name="Emotional Score" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#F1F5F9',
                }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Conversations" data={CONVERSATION_QUALITY} fill="#EC4899" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <TrendingUp className="w-5 h-5" />
              Meilleure conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
              {bestConversation.title}
            </p>
            <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
              <p>📊 Score émotionnel: <span className="font-bold">{bestConversation.averageEmotionalScore.toFixed(1)}/10</span></p>
              <p>🔥 Engagement: <span className="font-bold">{bestConversation.engagementLevel}%</span></p>
              <p>💬 Messages: <span className="font-bold">{bestConversation.messageCount}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <AlertCircle className="w-5 h-5" />
              À améliorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {worstConversation.title}
            </p>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <p>📊 Score émotionnel: <span className="font-bold">{worstConversation.averageEmotionalScore.toFixed(1)}/10</span></p>
              <p>🔥 Engagement: <span className="font-bold">{worstConversation.engagementLevel}%</span></p>
              <p>💡 <span>Essayez de structurer vos pensées avant la conversation</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Détail de toutes les conversations</CardTitle>
            <CardDescription>Analyse complète avec tous les métriques</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-3 font-semibold">Titre</th>
                  <th className="text-left py-3 px-3 font-semibold">Messages</th>
                  <th className="text-left py-3 px-3 font-semibold">Score émotionnel</th>
                  <th className="text-left py-3 px-3 font-semibold">Engagement</th>
                  <th className="text-left py-3 px-3 font-semibold">Durée (min)</th>
                </tr>
              </thead>
              <tbody>
                {CONVERSATION_QUALITY.map((conv) => (
                  <tr key={conv.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-medium">{conv.title}</td>
                    <td className="py-3 px-3">{conv.messageCount}</td>
                    <td className="py-3 px-3">
                      <Badge
                        className={
                          conv.averageEmotionalScore > 7
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : conv.averageEmotionalScore > 5
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }
                      >
                        {conv.averageEmotionalScore.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">{conv.engagementLevel}%</td>
                    <td className="py-3 px-3">{conv.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
