import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Calendar, Filter, Download,
  TrendingUp, Brain, Heart, Zap, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface HeatmapData {
  date: string;
  value: number;
  emotion: string;
  intensity: number;
  activities: string[];
}

interface EmotionStat {
  emotion: string;
  percentage: number;
  change: number;
  color: string;
  icon: string;
}

const EMOTION_CONFIG = [
  { key: 'happy', label: 'Heureux', className: 'bg-yellow-300', hex: '#FCD34D' },
  { key: 'calm', label: 'Calme', className: 'bg-blue-300', hex: '#93C5FD' },
  { key: 'anxious', label: 'Anxieux', className: 'bg-red-300', hex: '#FCA5A5' },
  { key: 'excited', label: 'Énergique', className: 'bg-orange-300', hex: '#FDBA74' },
  { key: 'tired', label: 'Fatigué', className: 'bg-gray-300', hex: '#D1D5DB' },
  { key: 'focused', label: 'Concentré', className: 'bg-purple-300', hex: '#D8B4FE' },
  { key: 'stressed', label: 'Stressé', className: 'bg-red-400', hex: '#F87171' },
] as const;

const INTENSITY_CONFIG = [
  { threshold: 1, label: 'Très léger', className: 'bg-green-100', hex: '#DCFCE7' },
  { threshold: 2, label: 'Léger', className: 'bg-green-200', hex: '#BBF7D0' },
  { threshold: 3, label: 'Modéré', className: 'bg-yellow-200', hex: '#FEF08A' },
  { threshold: 4, label: 'Élevé', className: 'bg-orange-200', hex: '#FED7AA' },
  { threshold: Number.POSITIVE_INFINITY, label: 'Intense', className: 'bg-red-200', hex: '#FECACA' },
] as const;

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;

const VIEW_LABELS: Record<'emotion' | 'intensity' | 'activity', string> = {
  emotion: 'Par émotion',
  intensity: 'Par intensité',
  activity: 'Par activité',
};

const PERIOD_LABELS: Record<string, string> = {
  week: 'Cette semaine',
  month: 'Ce mois',
  quarter: 'Ce trimestre',
  year: 'Cette année',
};

const DEFAULT_CELL_COLOR = '#E2E8F0';

const emotionLegend = EMOTION_CONFIG.map(({ label, hex }) => ({ label, color: hex }));
const intensityLegend = INTENSITY_CONFIG.map(({ label, hex }) => ({ label, color: hex }));

type EmotionKey = (typeof EMOTION_CONFIG)[number]['key'];

const getEmotionConfig = (emotion: string) =>
  EMOTION_CONFIG.find((preset) => preset.key === (emotion as EmotionKey));

const getIntensityPreset = (intensity: number) =>
  INTENSITY_CONFIG.find((preset) => intensity <= preset.threshold);

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
  strokeStyle?: string
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
};

const formatDateForExport = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
};

const HeatmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState<'emotion' | 'intensity' | 'activity'>('emotion');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Générer des données de heatmap pour les 30 derniers jours
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const emotions = ['happy', 'calm', 'anxious', 'excited', 'tired', 'focused', 'stressed'];
    const activities = ['meditation', 'vr', 'journal', 'music', 'scan'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.random() * 10,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.random() * 5 + 1,
        activities: activities.filter(() => Math.random() > 0.7),
      });
    }
    return data;
  };

  const [heatmapData] = useState<HeatmapData[]>(generateHeatmapData());
  
  const [emotionStats] = useState<EmotionStat[]>([
    { emotion: 'Heureux', percentage: 32, change: 5, color: 'bg-yellow-200', icon: '😊' },
    { emotion: 'Calme', percentage: 28, change: 2, color: 'bg-blue-200', icon: '😌' },
    { emotion: 'Énergique', percentage: 18, change: -3, color: 'bg-orange-200', icon: '⚡' },
    { emotion: 'Anxieux', percentage: 12, change: -2, color: 'bg-red-200', icon: '😰' },
    { emotion: 'Fatigué', percentage: 10, change: -2, color: 'bg-gray-200', icon: '😴' },
  ]);

  const getIntensityColor = (intensity: number): string =>
    getIntensityPreset(intensity)?.className ?? 'bg-gray-200';

  const getEmotionColor = (emotion: string): string =>
    getEmotionConfig(emotion)?.className ?? 'bg-gray-200';

  const getIntensityHex = (intensity: number): string =>
    getIntensityPreset(intensity)?.hex ?? DEFAULT_CELL_COLOR;

  const getEmotionHex = (emotion: string): string =>
    getEmotionConfig(emotion)?.hex ?? DEFAULT_CELL_COLOR;

  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  const getWeekNumber = (dateStr: string): number => {
    const date = new Date(dateStr);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const weeklyData = useMemo<(HeatmapData | null)[][]>(() => {
    const weeksMap = new Map<string, (HeatmapData | null)[]>();

    heatmapData.forEach((data) => {
      const date = new Date(data.date);
      const weekNumber = getWeekNumber(data.date);
      const key = `${date.getFullYear()}-${weekNumber}`;

      if (!weeksMap.has(key)) {
        weeksMap.set(key, Array(7).fill(null));
      }

      const weekDays = weeksMap.get(key);
      if (weekDays) {
        const dayOfWeek = (date.getDay() + 6) % 7; // Transforme dimanche=0 en dimanche=6
        weekDays[dayOfWeek] = data;
      }
    });

    return Array.from(weeksMap.entries())
      .sort(([aKey], [bKey]) => {
        const [aYear, aWeek] = aKey.split('-').map(Number);
        const [bYear, bWeek] = bKey.split('-').map(Number);
        if (aYear === bYear) {
          return aWeek - bWeek;
        }
        return aYear - bYear;
      })
      .map(([, days]) => days);
  }, [heatmapData]);

  const handleExportHeatmap = useCallback(() => {
    if (isExporting) return;
    if (!weeklyData.length) {
      toast({
        title: 'Export impossible',
        description: 'Aucune donnée n’est disponible pour générer une heatmap.',
        variant: 'warning',
      });
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    setIsExporting(true);

    try {
      const cellSize = 44;
      const cellGap = 8;
      const weekLabelWidth = 100;
      const contentPaddingX = 56;
      const contentPaddingY = 80;
      const headerSpacing = 160;
      const legendSpacing = selectedView === 'emotion' ? 240 : 190;
      const weeksCount = weeklyData.length;

      const gridWidth = DAY_LABELS.length * cellSize + (DAY_LABELS.length - 1) * cellGap;
      const gridHeight = weeksCount * cellSize + Math.max(0, weeksCount - 1) * cellGap;

      const cardWidth = weekLabelWidth + gridWidth + contentPaddingX * 2;
      const cardHeight = headerSpacing + gridHeight + legendSpacing;
      const canvasWidth = cardWidth + 64;
      const canvasHeight = cardHeight + 64;

      const canvas = document.createElement('canvas');
      const scale = window.devicePixelRatio || 1;
      canvas.width = canvasWidth * scale;
      canvas.height = canvasHeight * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('CanvasRenderingContext2D indisponible');
      }

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, '#EEF2FF');
      gradient.addColorStop(1, '#F8FAFC');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const cardX = 32;
      const cardY = 32;

      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 18;
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 28, '#ffffff');
      ctx.restore();
      drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 28, '#ffffff', 'rgba(148, 163, 184, 0.22)');

      const contentStartX = cardX + contentPaddingX;
      const contentStartY = cardY + contentPaddingY;
      const gridStartX = contentStartX + weekLabelWidth;
      const gridStartY = contentStartY + headerSpacing;

      const viewLabel = VIEW_LABELS[selectedView] ?? VIEW_LABELS.emotion;
      const periodLabel = PERIOD_LABELS[selectedPeriod] ?? 'Période personnalisée';
      const startDate = formatDateForExport(heatmapData[0]?.date);
      const endDate = formatDateForExport(heatmapData[heatmapData.length - 1]?.date);
      const rangeLabel = startDate && endDate ? `${startDate} – ${endDate}` : 'Période récente';
      const exportedAt = new Date().toLocaleString('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      ctx.textAlign = 'left';
      ctx.fillStyle = '#312E81';
      ctx.font = '600 28px "Inter", "Segoe UI", sans-serif';
      ctx.fillText('Carte émotionnelle', contentStartX, contentStartY);

      ctx.fillStyle = '#475569';
      ctx.font = '500 18px "Inter", "Segoe UI", sans-serif';
      ctx.fillText(`Vue actuelle : ${viewLabel}`, contentStartX, contentStartY + 36);
      ctx.fillText(`Période sélectionnée : ${periodLabel}`, contentStartX, contentStartY + 64);
      ctx.fillText(`Plage analysée : ${rangeLabel}`, contentStartX, contentStartY + 92);

      ctx.fillStyle = '#64748B';
      ctx.font = '400 16px "Inter", "Segoe UI", sans-serif';
      ctx.fillText(`Exporté le ${exportedAt}`, contentStartX, contentStartY + 122);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#475569';
      ctx.font = '600 16px "Inter", "Segoe UI", sans-serif';
      DAY_LABELS.forEach((label, index) => {
        const labelX = gridStartX + index * (cellSize + cellGap) + cellSize / 2;
        ctx.fillText(label, labelX, gridStartY - 20);
      });

      weeklyData.forEach((week, rowIndex) => {
        const rowY = gridStartY + rowIndex * (cellSize + cellGap);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#64748B';
        ctx.font = '500 14px "Inter", "Segoe UI", sans-serif';
        ctx.fillText(`Sem ${rowIndex + 1}`, gridStartX - 16, rowY + cellSize / 2 + 5);

        for (let dayIndex = 0; dayIndex < DAY_LABELS.length; dayIndex++) {
          const cellX = gridStartX + dayIndex * (cellSize + cellGap);
          const cellData = week[dayIndex];
          const fillColor = cellData
            ? selectedView === 'emotion'
              ? getEmotionHex(cellData.emotion)
              : getIntensityHex(cellData.intensity)
            : DEFAULT_CELL_COLOR;

          drawRoundedRect(ctx, cellX, rowY, cellSize, cellSize, 10, fillColor, 'rgba(148, 163, 184, 0.32)');

          if (cellData) {
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
            ctx.font = '500 12px "Inter", "Segoe UI", sans-serif';
            ctx.fillText(cellData.value.toFixed(1), cellX + cellSize / 2, rowY + cellSize / 2 + 4);
          }
        }
      });

      const legendTitleY = gridStartY + gridHeight + 52;
      const legendItems = selectedView === 'emotion' ? emotionLegend : intensityLegend;
      const legendColumns = 2;
      const legendColumnWidth = 220;
      const legendRowSpacing = 36;
      const legendDescription =
        selectedView === 'emotion'
          ? 'Couleurs associées aux émotions principales'
          : selectedView === 'activity'
            ? 'Niveau d’activité des routines émotionnelles'
            : 'Échelle d’intensité émotionnelle (faible à forte)';

      ctx.textAlign = 'left';
      ctx.fillStyle = '#312E81';
      ctx.font = '600 20px "Inter", "Segoe UI", sans-serif';
      ctx.fillText('Légende', contentStartX, legendTitleY);

      ctx.fillStyle = '#475569';
      ctx.font = '400 15px "Inter", "Segoe UI", sans-serif';
      ctx.fillText(legendDescription, contentStartX, legendTitleY + 26);

      legendItems.forEach((item, index) => {
        const column = index % legendColumns;
        const row = Math.floor(index / legendColumns);
        const legendX = contentStartX + column * legendColumnWidth;
        const legendY = legendTitleY + 56 + row * legendRowSpacing;

        drawRoundedRect(ctx, legendX, legendY - 18, 24, 24, 6, item.color, 'rgba(148, 163, 184, 0.28)');

        ctx.fillStyle = '#1F2937';
        ctx.font = '500 15px "Inter", "Segoe UI", sans-serif';
        ctx.fillText(item.label, legendX + 34, legendY);
      });

      ctx.fillStyle = '#94A3B8';
      ctx.font = '400 12px "Inter", "Segoe UI", sans-serif';
      ctx.fillText('Export généré par EmotionsCare', contentStartX, cardY + cardHeight - 24);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `heatmap-${selectedView}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export réussi',
        description: 'La heatmap a été sauvegardée au format PNG.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Heatmap export failed', error);
      toast({
        title: "L'export a échoué",
        description: 'Nous n’avons pas pu générer le PNG. Réessayez dans un instant.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [
    heatmapData,
    isExporting,
    selectedPeriod,
    selectedView,
    toast,
    weeklyData,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Carte Émotionnelle</h1>
              <p className="text-sm text-muted-foreground">Visualisation de vos états émotionnels</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportHeatmap}
              disabled={isExporting}
              aria-busy={isExporting}
            >
              <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Export en cours…' : 'Exporter'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Contrôles */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedView}
            onValueChange={(value) => setSelectedView(value as 'emotion' | 'intensity' | 'activity')}
          >
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emotion">Par émotion</SelectItem>
              <SelectItem value="intensity">Par intensité</SelectItem>
              <SelectItem value="activity">Par activité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Heatmap Principal */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Statistiques Rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Bien-être moyen</p>
              </Card>
              <Card className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Jours positifs</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-sm text-muted-foreground">Amélioration</p>
              </Card>
              <Card className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
              </Card>
            </div>

            {/* Heatmap Grid */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Activité Émotionnelle - 30 derniers jours</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>Faible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                    <span>Moyen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-300 rounded"></div>
                    <span>Élevé</span>
                  </div>
                </div>
              </div>

              {/* Jours de la semaine */}
              <div className="mb-4">
                <div className="grid grid-cols-8 gap-1 text-xs text-muted-foreground">
                  <div></div>
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mer</div>
                  <div>Jeu</div>
                  <div>Ven</div>
                  <div>Sam</div>
                  <div>Dim</div>
                </div>
              </div>

              {/* Grille heatmap */}
              <div className="space-y-1">
                {weeklyData.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-8 gap-1">
                    <div className="text-xs text-muted-foreground pr-2">
                      Sem {weekIndex + 1}
                    </div>
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const data = week[dayIndex];
                      if (!data) return <div key={dayIndex} className="w-4 h-4"></div>;
                      
                      const color = selectedView === 'emotion' 
                        ? getEmotionColor(data.emotion)
                        : getIntensityColor(data.intensity);
                      
                      return (
                        <motion.div
                          key={data.date}
                          className={`w-4 h-4 rounded-sm cursor-pointer ${color} hover:ring-2 hover:ring-purple-300 transition-all`}
                          whileHover={{ scale: 1.2 }}
                          onClick={() => setSelectedDate(data.date)}
                          title={`${data.date}: ${data.emotion} (${data.intensity.toFixed(1)})`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Détail du jour sélectionné */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-purple-50 rounded-lg border"
                >
                  {(() => {
                    const dayData = heatmapData.find(d => d.date === selectedDate);
                    if (!dayData) return null;
                    
                    return (
                      <div>
                        <h3 className="font-semibold mb-2">
                          {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Émotion:</span>
                            <p className="font-semibold capitalize">{dayData.emotion}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Intensité:</span>
                            <p className="font-semibold">{dayData.intensity.toFixed(1)}/5</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Activités:</span>
                            <p className="font-semibold">{dayData.activities.length}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <p className="font-semibold">{dayData.value.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </Card>

            {/* Patterns Temporels */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Patterns Temporels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Meilleures heures
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">8h - 10h</span>
                      <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">14h - 16h</span>
                      <Badge className="bg-blue-100 text-blue-700">Bon</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-500" />
                    Heures difficiles
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span className="text-sm">11h - 12h</span>
                      <Badge className="bg-orange-100 text-orange-700">Attention</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">18h - 19h</span>
                      <Badge className="bg-red-100 text-red-700">Difficile</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Statistiques */}
          <div className="space-y-6">
            
            {/* Distribution des Émotions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Distribution des Émotions</h3>
              <div className="space-y-3">
                {emotionStats.map((stat) => (
                  <div key={stat.emotion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <span>{stat.icon}</span>
                        {stat.emotion}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">{stat.percentage}%</span>
                        <span className={`text-xs ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stat.color}`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommandations */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <h3 className="font-semibold mb-3 text-purple-900">💡 Recommandations</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <p>• Vos matinées sont vos moments les plus productifs</p>
                <p>• Planifiez une pause méditation vers 11h</p>
                <p>• Évitez les tâches stressantes après 18h</p>
                <p>• Votre bien-être s'améliore de 12% ce mois-ci !</p>
              </div>
            </Card>

            {/* Objectifs de la Semaine */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">🎯 Objectifs</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Jours positifs</span>
                  <span className="font-semibold">6/7</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Sessions bien-être</span>
                  <span className="font-semibold">12/15</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Stabilité émotionnelle</span>
                  <span className="font-semibold">85%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;