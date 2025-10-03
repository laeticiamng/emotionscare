export interface AmbitionQuest {
  id: string;
  title: string;
  flavor: string;
  status: 'available' | 'in_progress' | 'completed';
  xp_reward?: number;
  est_minutes?: number;
  completed_at?: Date | string;
  result?: string;
}

export interface AmbitionArtifact {
  id: string;
  name: string;
  icon?: string;
  rarity: string;
}

export interface AmbitionRun {
  id: string;
  objective: string;
  tags?: string[];
  quests?: AmbitionQuest[];
  artifacts?: AmbitionArtifact[];
  metadata?: {
    totalXp?: number;
  };
}
