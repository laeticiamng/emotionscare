/**
 * Service Emotion Atlas
 * Gestion des données de cartographie émotionnelle
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { AtlasData, AtlasFilter, AtlasInsight, EmotionNode, EmotionConnection, EMOTION_COLORS, EMOTION_CATEGORIES } from './types';

export interface EmotionAtlasStats {
  totalEmotions: number;
  uniqueEmotions: number;
  dominantEmotion: string;
  emotionDiversity: number; // 0-100
  positiveRatio: number;
  averageIntensity: number;
  streakDays: number;
}

/**
 * Service de cartographie émotionnelle
 */
export const EmotionAtlasService = {
  /**
   * Récupère les données de l'atlas pour un utilisateur
   */
  async getAtlasData(userId: string, filter: AtlasFilter): Promise<AtlasData> {
    try {
      // Calculer les dates selon le filtre
      const { start, end } = this.getDateRange(filter.timeRange);

      // Récupérer les entrées d'émotions depuis plusieurs sources
      const [scansData, journalData] = await Promise.all([
        this.fetchEmotionScans(userId, start, end),
        this.fetchJournalEmotions(userId, start, end),
      ]);

      // Fusionner et agréger les données
      const allEmotions = [...scansData, ...journalData];
      
      // Filtrer par intensité et catégories
      const filtered = allEmotions.filter(e => {
        if (e.intensity < filter.minIntensity) return false;
        if (filter.categories.length > 0 && !filter.categories.includes(e.category)) return false;
        return true;
      });

      // Construire les nodes et connections
      const nodes = this.buildNodes(filtered);
      const connections = this.buildConnections(nodes);
      const dominantEmotion = this.findDominant(nodes);

      return {
        nodes,
        connections,
        timeRange: { start, end },
        totalEntries: filtered.length,
        dominantEmotion,
      };
    } catch (error) {
      logger.error('EmotionAtlasService.getAtlasData error', error as Error, 'MODULE');
      throw error;
    }
  },

  /**
   * Récupère les scans d'émotions
   */
  async fetchEmotionScans(userId: string, start: Date, end: Date) {
    const { data, error } = await supabase
      .from('emotion_scans')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Error fetching emotion scans', { error: error.message });
      return [];
    }

    return (data || []).map(scan => ({
      emotion: scan.dominant_emotion || 'neutre',
      intensity: scan.confidence_score || 50,
      category: this.getCategory(scan.dominant_emotion || 'neutre'),
      source: 'scan' as const,
      timestamp: new Date(scan.created_at),
    }));
  },

  /**
   * Récupère les émotions depuis le journal
   */
  async fetchJournalEmotions(userId: string, start: Date, end: Date) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('Error fetching journal emotions', { error: error.message });
      return [];
    }

    return (data || []).flatMap(entry => {
      const emotions = entry.detected_emotions || [];
      return emotions.map((e: { name: string; score: number }) => ({
        emotion: e.name || 'neutre',
        intensity: Math.round((e.score || 0.5) * 100),
        category: this.getCategory(e.name || 'neutre'),
        source: 'journal' as const,
        timestamp: new Date(entry.created_at),
      }));
    });
  },

  /**
   * Construit les nodes de l'atlas
   */
  buildNodes(emotions: Array<{ emotion: string; intensity: number; category: string }>): EmotionNode[] {
    const grouped = new Map<string, { count: number; totalIntensity: number }>();

    emotions.forEach(e => {
      const existing = grouped.get(e.emotion) || { count: 0, totalIntensity: 0 };
      grouped.set(e.emotion, {
        count: existing.count + 1,
        totalIntensity: existing.totalIntensity + e.intensity,
      });
    });

    const nodes: EmotionNode[] = [];
    let index = 0;

    grouped.forEach((data, emotion) => {
      const avgIntensity = data.totalIntensity / data.count;
      const angle = (index / grouped.size) * Math.PI * 2;
      const radius = 150 + (100 - avgIntensity);

      nodes.push({
        id: emotion,
        emotion,
        intensity: Math.round(avgIntensity),
        frequency: data.count,
        color: this.getColor(emotion),
        x: 250 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        size: Math.min(60, 20 + data.count * 5),
        connections: [],
      });

      index++;
    });

    return nodes;
  },

  /**
   * Construit les connexions entre émotions
   */
  buildConnections(nodes: EmotionNode[]): EmotionConnection[] {
    const connections: EmotionConnection[] = [];
    const connectionPairs = [
      ['joie', 'gratitude'],
      ['joie', 'enthousiasme'],
      ['tristesse', 'mélancolie'],
      ['colère', 'frustration'],
      ['peur', 'anxiété'],
      ['calme', 'sérénité'],
      ['amour', 'gratitude'],
      ['espoir', 'enthousiasme'],
    ];

    connectionPairs.forEach(([source, target]) => {
      const sourceNode = nodes.find(n => n.emotion === source);
      const targetNode = nodes.find(n => n.emotion === target);

      if (sourceNode && targetNode) {
        const strength = Math.min(1, (sourceNode.frequency + targetNode.frequency) / 20);
        connections.push({ source, target, strength });
        sourceNode.connections.push(target);
        targetNode.connections.push(source);
      }
    });

    return connections;
  },

  /**
   * Trouve l'émotion dominante
   */
  findDominant(nodes: EmotionNode[]): string {
    if (nodes.length === 0) return 'neutre';
    return nodes.reduce((max, node) => 
      node.frequency > max.frequency ? node : max
    ).emotion;
  },

  /**
   * Génère des insights basés sur les données
   */
  async getInsights(userId: string, data: AtlasData): Promise<AtlasInsight[]> {
    const insights: AtlasInsight[] = [];

    // Insight sur l'émotion dominante
    if (data.dominantEmotion) {
      const category = this.getCategory(data.dominantEmotion);
      insights.push({
        id: 'dominant',
        type: 'pattern',
        title: `${data.dominantEmotion} est votre émotion principale`,
        description: `Cette émotion apparaît le plus fréquemment dans vos enregistrements.`,
        emotion: data.dominantEmotion,
        severity: category === 'positive' ? 'success' : category === 'negative' ? 'warning' : 'info',
        actionable: false,
      });
    }

    // Insight sur la diversité émotionnelle
    const diversity = data.nodes.length;
    if (diversity >= 5) {
      insights.push({
        id: 'diversity-high',
        type: 'pattern',
        title: 'Grande diversité émotionnelle',
        description: `Vous exprimez ${diversity} émotions différentes, signe d'une bonne conscience émotionnelle.`,
        severity: 'success',
        actionable: false,
      });
    } else if (diversity <= 2) {
      insights.push({
        id: 'diversity-low',
        type: 'recommendation',
        title: 'Explorez vos émotions',
        description: 'Essayez de nommer plus précisément ce que vous ressentez pour enrichir votre vocabulaire émotionnel.',
        severity: 'info',
        actionable: true,
      });
    }

    // Insight sur le ratio positif/négatif
    const positiveNodes = data.nodes.filter(n => this.getCategory(n.emotion) === 'positive');
    const negativeNodes = data.nodes.filter(n => this.getCategory(n.emotion) === 'negative');
    const posFreq = positiveNodes.reduce((sum, n) => sum + n.frequency, 0);
    const negFreq = negativeNodes.reduce((sum, n) => sum + n.frequency, 0);

    if (posFreq > 0 && negFreq > 0) {
      const ratio = posFreq / (posFreq + negFreq);
      if (ratio >= 0.6) {
        insights.push({
          id: 'ratio-positive',
          type: 'trend',
          title: 'Tendance positive',
          description: `${Math.round(ratio * 100)}% de vos émotions sont positives. Continuez ainsi !`,
          severity: 'success',
          actionable: false,
        });
      } else if (ratio <= 0.3) {
        insights.push({
          id: 'ratio-negative',
          type: 'recommendation',
          title: 'Besoin de soutien ?',
          description: 'Vos émotions récentes sont majoritairement difficiles. Essayez une activité de bien-être.',
          severity: 'warning',
          actionable: true,
        });
      }
    }

    return insights;
  },

  /**
   * Récupère les statistiques de l'atlas
   */
  async getStats(userId: string): Promise<EmotionAtlasStats> {
    const filter: AtlasFilter = {
      timeRange: 'month',
      minIntensity: 0,
      sources: ['scan', 'journal', 'voice', 'text'],
      categories: ['positive', 'neutral', 'negative'],
    };

    const data = await this.getAtlasData(userId, filter);

    const positiveNodes = data.nodes.filter(n => this.getCategory(n.emotion) === 'positive');
    const posFreq = positiveNodes.reduce((sum, n) => sum + n.frequency, 0);
    const totalFreq = data.nodes.reduce((sum, n) => sum + n.frequency, 0);
    const avgIntensity = data.nodes.length > 0
      ? data.nodes.reduce((sum, n) => sum + n.intensity, 0) / data.nodes.length
      : 0;

    // Calculate streak days from mood entries
    const streakDays = await this.calculateStreakDays(userId);

    return {
      totalEmotions: data.totalEntries,
      uniqueEmotions: data.nodes.length,
      dominantEmotion: data.dominantEmotion,
      emotionDiversity: Math.min(100, data.nodes.length * 10),
      positiveRatio: totalFreq > 0 ? Math.round((posFreq / totalFreq) * 100) : 50,
      averageIntensity: Math.round(avgIntensity),
      streakDays,
    };
  },

  /**
   * Calcule les jours de streak consécutifs
   */
  async calculateStreakDays(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(90);

      if (error || !data || data.length === 0) return 0;

      const dates = data.map(e => new Date(e.created_at).toDateString());
      const uniqueDates = [...new Set(dates)].sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );

      if (uniqueDates.length === 0) return 0;

      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      // Check if streak is active
      if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

      let streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]).getTime();
        const curr = new Date(uniqueDates[i]).getTime();
        const diffDays = Math.round((prev - curr) / 86400000);
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (err) {
      logger.error('Error calculating streak', err as Error, 'EMOTION_ATLAS');
      return 0;
    }
  },

  /**
   * Helpers
   */
  getDateRange(range: AtlasFilter['timeRange']): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'all':
        start.setFullYear(2020);
        break;
    }

    return { start, end };
  },

  getCategory(emotion: string): 'positive' | 'neutral' | 'negative' {
    const categories: Record<string, 'positive' | 'neutral' | 'negative'> = {
      joie: 'positive',
      tristesse: 'negative',
      colère: 'negative',
      peur: 'negative',
      surprise: 'neutral',
      dégoût: 'negative',
      calme: 'positive',
      anxiété: 'negative',
      amour: 'positive',
      espoir: 'positive',
      gratitude: 'positive',
      fierté: 'positive',
      sérénité: 'positive',
      enthousiasme: 'positive',
      confusion: 'neutral',
      frustration: 'negative',
      ennui: 'neutral',
      mélancolie: 'negative',
    };
    return categories[emotion.toLowerCase()] || 'neutral';
  },

  getColor(emotion: string): string {
    const colors: Record<string, string> = {
      joie: 'hsl(48, 95%, 53%)',
      tristesse: 'hsl(220, 70%, 50%)',
      colère: 'hsl(0, 80%, 50%)',
      peur: 'hsl(280, 60%, 45%)',
      surprise: 'hsl(170, 70%, 45%)',
      dégoût: 'hsl(90, 50%, 40%)',
      calme: 'hsl(200, 60%, 55%)',
      anxiété: 'hsl(25, 70%, 50%)',
      amour: 'hsl(340, 80%, 55%)',
      espoir: 'hsl(120, 50%, 50%)',
      gratitude: 'hsl(45, 80%, 55%)',
      fierté: 'hsl(270, 60%, 55%)',
      sérénité: 'hsl(180, 50%, 50%)',
      enthousiasme: 'hsl(35, 90%, 55%)',
      confusion: 'hsl(300, 30%, 50%)',
      frustration: 'hsl(15, 70%, 50%)',
      ennui: 'hsl(210, 20%, 50%)',
      mélancolie: 'hsl(230, 40%, 45%)',
    };
    return colors[emotion.toLowerCase()] || 'hsl(200, 50%, 50%)';
  },
};

export const emotionAtlasService = EmotionAtlasService;
export default EmotionAtlasService;
