import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  Heart,
  Brain,
  AlertCircle,
} from 'lucide-react';

interface EmotionalData {
  date: string;
  joy: number;
  sadness: number;
  anxiety: number;
  anger: number;
  calm: number;
  neutral: number;
}

interface ProgressData {
  week: string;
  flexibility: number;
  resilience: number;
  awareness: number;
  acceptance: number;
}

const EMOTION_DATA: EmotionalData[] = [
  { date: 'Lun', joy: 6, sadness: 2, anxiety: 4, anger: 1, calm: 7, neutral: 5 },
  { date: 'Mar', joy: 7, sadness: 1, anxiety: 3, anger: 1, calm: 8, neutral: 5 },
  { date: 'Mer', joy: 5, sadness: 3, anxiety: 5, anger: 2, calm: 6, neutral: 4 },
  { date: 'Jeu', joy: 8, sadness: 1, anxiety: 2, anger: 1, calm: 8, neutral: 5 },
  { date: 'Ven', joy: 7, sadness: 2, anxiety: 3, anger: 1, calm: 8, neutral: 5 },
  { date: 'Sam', joy: 9, sadness: 1, anxiety: 1, anger: 0, calm: 9, neutral: 3 },
  { date: 'Dim', joy: 6, sadness: 2, anxiety: 4, anger: 1, calm: 7, neutral: 5 },
];

const PROGRESS_DATA: ProgressData[] = [
  { week: 'S1', flexibility: 65, resilience: 60, awareness: 70, acceptance: 65 },
  { week: 'S2', flexibility: 68, resilience: 65, awareness: 72, acceptance: 68 },
  { week: 'S3', flexibility: 70, resilience: 68, awareness: 75, acceptance: 70 },
  { week: 'S4', flexibility: 72, resilience: 72, awareness: 78, acceptance: 73 },
];

const RADAR_DATA = [
  { metric: 'Flexibilité', A: 72, fullMark: 100 },
  { metric: 'Résilience', A: 68, fullMark: 100 },
  { metric: 'Conscience', A: 75, fullMark: 100 },
  { metric: 'Acceptation', A: 70, fullMark: 100 },
  { metric: 'Engagement', A: 73, fullMark: 100 },
];

const EMOTION_COLORS = {
  joy: '#FBBF24',
  sadness: '#60A5FA',
  anxiety: '#F87171',
  anger: '#F97316',
  calm: '#34D399',
  neutral: '#9CA3AF',
};

export const CoachEmotionTracker = () => {
  const [_period, _setPeriod] = useState('week');
  const [selectedEmotion, setSelectedEmotion] = useState<'all' | keyof Omit<EmotionalData, 'date'>>('all');

  const getDominantEmotion = () => {
    const lastDay = EMOTION_DATA[EMOTION_DATA.length - 1];
    const emotions = [
      { name: 'Calme', value: lastDay.calm },
      { name: 'Joyeux', value: lastDay.joy },
      { name: 'Neutre', value: lastDay.neutral },
      { name: 'Anxieux', value: lastDay.anxiety },
      { name: 'Triste', value: lastDay.sadness },
      { name: 'Colère', value: lastDay.anger },
    ];
    return emotions.sort((a, b) => b.value - a.value)[0];
  };

  const getEmotionTrend = () => {
    if (EMOTION_DATA.length < 2) return 'stable';
    const lastDay = EMOTION_DATA[EMOTION_DATA.length - 1];
    const previousDay = EMOTION_DATA[EMOTION_DATA.length - 2];
    const lastScore = (lastDay.calm + lastDay.joy) / 2;
    const previousScore = (previousDay.calm + previousDay.joy) / 2;
    if (lastScore > previousScore) return 'up';
    if (lastScore < previousScore) return 'down';
    return 'stable';
  };

  const dominant = getDominantEmotion();
  const trend = getEmotionTrend();

  return (
    <div className="space-y-6 w-full">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Suivi émotionnel
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Analysez l'évolution de vos émotions et votre flexibilité psychologique
        </p>
      </div>

      {/* Cards de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Émotion dominante */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              État actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {dominant.name}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intensité: <span className="font-semibold">{dominant.value}/10</span>
            </p>
          </CardContent>
        </Card>

        {/* Tendance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              {trend === 'up' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  ↗ En amélioration
                </Badge>
              )}
              {trend === 'down' && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                  ↘ En déclin
                </Badge>
              )}
              {trend === 'stable' && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  → Stable
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Par rapport à hier
            </p>
          </CardContent>
        </Card>

        {/* Score de flexibilité */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Flexibilité AAQ-II
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">72%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +3 pts cette semaine
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour différentes vues */}
      <Tabs defaultValue="emotions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="progress">Progrès</TabsTrigger>
          <TabsTrigger value="radar">Profil</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Onglet Émotions */}
        <TabsContent value="emotions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évolution des émotions</CardTitle>
                  <CardDescription>
                    Suivi quotidien de vos états émotionnels
                  </CardDescription>
                </div>
                <Select value={selectedEmotion} onValueChange={(value: any) => setSelectedEmotion(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les émotions</SelectItem>
                    <SelectItem value="joy">Joie</SelectItem>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="anxiety">Anxiété</SelectItem>
                    <SelectItem value="sadness">Tristesse</SelectItem>
                    <SelectItem value="anger">Colère</SelectItem>
                    <SelectItem value="neutral">Neutre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={EMOTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" />
                  <YAxis stroke="#64748B" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#F1F5F9',
                    }}
                  />
                  <Legend />
                  {selectedEmotion === 'all' ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="joy"
                        stackId="1"
                        stroke={EMOTION_COLORS.joy}
                        fill={EMOTION_COLORS.joy}
                        name="Joie"
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="calm"
                        stackId="1"
                        stroke={EMOTION_COLORS.calm}
                        fill={EMOTION_COLORS.calm}
                        name="Calme"
                        isAnimationActive={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="anxiety"
                        stackId="1"
                        stroke={EMOTION_COLORS.anxiety}
                        fill={EMOTION_COLORS.anxiety}
                        name="Anxiété"
                        isAnimationActive={false}
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={selectedEmotion}
                      stroke={EMOTION_COLORS[selectedEmotion as keyof typeof EMOTION_COLORS]}
                      dot={{ fill: EMOTION_COLORS[selectedEmotion as keyof typeof EMOTION_COLORS], r: 5 }}
                      activeDot={{ r: 7 }}
                      strokeWidth={2}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Progrès */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progrès sur 4 semaines</CardTitle>
              <CardDescription>
                Évolution de votre flexibilité psychologique et résilience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={PROGRESS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" stroke="#64748B" />
                  <YAxis stroke="#64748B" domain={[0, 100]} />
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
                    type="monotone"
                    dataKey="flexibility"
                    stroke="#8B5CF6"
                    dot={{ fill: '#8B5CF6', r: 5 }}
                    strokeWidth={2}
                    name="Flexibilité"
                  />
                  <Line
                    type="monotone"
                    dataKey="resilience"
                    stroke="#10B981"
                    dot={{ fill: '#10B981', r: 5 }}
                    strokeWidth={2}
                    name="Résilience"
                  />
                  <Line
                    type="monotone"
                    dataKey="awareness"
                    stroke="#F59E0B"
                    dot={{ fill: '#F59E0B', r: 5 }}
                    strokeWidth={2}
                    name="Conscience"
                  />
                  <Line
                    type="monotone"
                    dataKey="acceptance"
                    stroke="#3B82F6"
                    dot={{ fill: '#3B82F6', r: 5 }}
                    strokeWidth={2}
                    name="Acceptation"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Radar */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Profil de développement personnel</CardTitle>
              <CardDescription>
                Vos forces et domaines de croissance actuels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="metric" stroke="#64748B" />
                  <PolarRadiusAxis domain={[0, 100]} stroke="#64748B" />
                  <Radar
                    name="Score actuel"
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Insights */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Analyses et recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  📈 Amélioration notable
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Votre flexibilité psychologique a augmenté de 7 points sur les 4 dernières semaines. Continuez à pratiquer la respiration et le journaling!
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  ⚠️ Pattern détecté
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  Votre anxiété tend à augmenter vers le jeudi. Envisagez une activité relaxante en milieu de semaine.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  ✨ Force identifiée
                </p>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Vous maintenez un excellent niveau de calme le weekend. Partagez ce que vous faites le samedi/dimanche avec votre coach!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
