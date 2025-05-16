
// Mise à jour de TeamOverviewProps pour inclure toutes les propriétés requises

export interface TeamOverviewProps {
  userId?: string;
  period?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionResult {
  // Définissez votre type de résultat d'émotion ici
  id?: string;
  userId?: string;
  user_id?: string; // Ajouté pour compatibilité
  emotion?: string;
  intensity?: number;
  timestamp?: string | Date;
  source?: string;
  context?: string;
  tags?: string[];
  notes?: string;
  category?: string;
  score?: number;
  feedback?: string;
  ai_feedback?: string;
  confidence?: number;
  recommendations?: string[];
}
