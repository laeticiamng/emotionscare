/**
 * Types pour le module SEUIL (Threshold)
 * Régulation émotionnelle proactive
 */

export type SeuilZone = 'low' | 'intermediate' | 'critical' | 'closure';

export type SeuilActionType = 
  | '3min' 
  | '5min_guided' 
  | 'change_activity' 
  | 'postpone' 
  | 'stop_today' 
  | 'close_day';

export interface SeuilEvent {
  id: string;
  userId: string;
  thresholdLevel: number;
  zone: SeuilZone;
  actionTaken?: string;
  actionType?: SeuilActionType;
  sessionCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeuilZoneConfig {
  zone: SeuilZone;
  range: [number, number];
  message: string;
  subMessage?: string;
  actions: SeuilAction[];
  ambiance: {
    gradient: string;
    iconColor: string;
  };
}

export interface SeuilAction {
  id: SeuilActionType;
  label: string;
  description?: string;
  icon: string;
}

export interface CreateSeuilEventInput {
  thresholdLevel: number;
  zone: SeuilZone;
  actionType?: SeuilActionType;
  actionTaken?: string;
  notes?: string;
}
