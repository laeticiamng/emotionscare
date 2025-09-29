export interface AmbitionQuestTemplate {
  id: string;
  title: string;
  flavor: string;
  estimatedMinutes: number;
  xpReward: number;
  tags: string[];
}

export interface AmbitionArtifact {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export interface AmbitionRun {
  id: string;
  objective: string;
  status: 'active' | 'completed' | 'paused';
  metadata: Record<string, any>;
}