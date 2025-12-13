// @ts-nocheck
/**
 * Innovation Types - Système de gestion des expérimentations
 * Types pour les expériences A/B, feature flags et innovation
 */

/** Expérience/Expérimentation */
export interface Experiment {
  id: string;
  name: string;
  description?: string;
  status: ExperimentStatus;
  createdAt?: string;
  updatedAt?: string;
  startedAt?: string;
  endedAt?: string;
  createdBy?: string;
  type: ExperimentType;
  hypothesis?: string;
  variants: ExperimentVariant[];
  targetAudience?: TargetAudience;
  metrics: ExperimentMetric[];
  config: ExperimentConfig;
  results?: ExperimentResults;
  tags?: string[];
  [key: string]: unknown;
}

/** Statut d'expérience */
export type ExperimentStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'
  | 'cancelled';

/** Type d'expérience */
export type ExperimentType =
  | 'ab_test'
  | 'multivariate'
  | 'feature_flag'
  | 'rollout'
  | 'holdout'
  | 'bandit';

/** Variante d'expérience */
export interface ExperimentVariant {
  id: string;
  name: string;
  description?: string;
  weight: number;
  isControl: boolean;
  config: Record<string, unknown>;
  participants: number;
  conversions?: number;
}

/** Audience cible */
export interface TargetAudience {
  type: 'all' | 'segment' | 'percentage' | 'custom';
  percentage?: number;
  segments?: string[];
  rules?: AudienceRule[];
  excludeRules?: AudienceRule[];
}

/** Règle d'audience */
export interface AudienceRule {
  field: string;
  operator: RuleOperator;
  value: unknown;
  negate?: boolean;
}

/** Opérateur de règle */
export type RuleOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'
  | 'regex';

/** Métrique d'expérience */
export interface ExperimentMetric {
  id: string;
  name: string;
  type: MetricType;
  isPrimary: boolean;
  goalDirection: 'increase' | 'decrease' | 'neutral';
  minimumDetectableEffect: number;
  query?: string;
  eventName?: string;
  aggregation?: MetricAggregation;
}

/** Type de métrique */
export type MetricType =
  | 'conversion'
  | 'count'
  | 'duration'
  | 'revenue'
  | 'engagement'
  | 'retention'
  | 'custom';

/** Agrégation de métrique */
export type MetricAggregation =
  | 'sum'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'count'
  | 'unique';

/** Configuration d'expérience */
export interface ExperimentConfig {
  sampleSize: number;
  confidenceLevel: number;
  duration: number;
  startDate?: string;
  endDate?: string;
  autoStop: boolean;
  autoStopThreshold?: number;
  allowReentry: boolean;
  persistAssignment: boolean;
  mutuallyExclusive?: string[];
}

/** Résultats d'expérience */
export interface ExperimentResults {
  status: 'pending' | 'inconclusive' | 'winner' | 'loser';
  winner?: string;
  confidence: number;
  sampleSize: number;
  duration: number;
  startDate: string;
  endDate?: string;
  variantResults: VariantResult[];
  statisticalSignificance: boolean;
  pValue?: number;
  effectSize?: number;
  powerAnalysis?: PowerAnalysis;
}

/** Résultat par variante */
export interface VariantResult {
  variantId: string;
  variantName: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  improvement?: number;
  confidenceInterval: [number, number];
  metrics: Record<string, MetricResult>;
}

/** Résultat de métrique */
export interface MetricResult {
  value: number;
  baseline?: number;
  change?: number;
  changePercent?: number;
  isSignificant: boolean;
  pValue?: number;
}

/** Analyse de puissance statistique */
export interface PowerAnalysis {
  achievedPower: number;
  requiredSampleSize: number;
  currentSampleSize: number;
  minimumDetectableEffect: number;
}

/** Feature Flag */
export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  status: 'enabled' | 'disabled' | 'conditional';
  type: FeatureFlagType;
  defaultValue: unknown;
  rules: FeatureFlagRule[];
  variants?: FeatureFlagVariant[];
  metadata?: FeatureFlagMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

/** Type de feature flag */
export type FeatureFlagType =
  | 'boolean'
  | 'string'
  | 'number'
  | 'json';

/** Règle de feature flag */
export interface FeatureFlagRule {
  id: string;
  priority: number;
  conditions: RuleCondition[];
  value: unknown;
  percentage?: number;
}

/** Condition de règle */
export interface RuleCondition {
  attribute: string;
  operator: RuleOperator;
  value: unknown;
}

/** Variante de feature flag */
export interface FeatureFlagVariant {
  id: string;
  name: string;
  value: unknown;
  weight: number;
}

/** Métadonnées de feature flag */
export interface FeatureFlagMetadata {
  owner?: string;
  team?: string;
  jiraTicket?: string;
  releaseVersion?: string;
  sunsetDate?: string;
  documentation?: string;
  tags?: string[];
}

/** Innovation Project */
export interface InnovationProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  owner: string;
  team: string[];
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string;
  objectives: ProjectObjective[];
  experiments: string[];
  featureFlags: string[];
  metrics: ProjectMetric[];
  risks: ProjectRisk[];
  updates: ProjectUpdate[];
}

/** Statut de projet */
export type ProjectStatus =
  | 'proposed'
  | 'approved'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

/** Phase de projet */
export type ProjectPhase =
  | 'discovery'
  | 'design'
  | 'development'
  | 'testing'
  | 'rollout'
  | 'evaluation';

/** Objectif de projet */
export interface ProjectObjective {
  id: string;
  description: string;
  keyResults: KeyResult[];
  status: 'pending' | 'in_progress' | 'achieved' | 'missed';
}

/** Résultat clé */
export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

/** Métrique de projet */
export interface ProjectMetric {
  name: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
}

/** Risque de projet */
export interface ProjectRisk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation?: string;
  status: 'identified' | 'mitigated' | 'occurred';
}

/** Mise à jour de projet */
export interface ProjectUpdate {
  id: string;
  date: string;
  author: string;
  content: string;
  type: 'progress' | 'blocker' | 'decision' | 'milestone';
}

/** Assignation d'expérience pour un utilisateur */
export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  userId: string;
  assignedAt: string;
  context?: Record<string, unknown>;
}

/** Événement d'expérience */
export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  eventType: string;
  eventValue?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/** Stats d'innovation */
export interface InnovationStats {
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  winRate: number;
  totalFeatureFlags: number;
  enabledFeatureFlags: number;
  totalProjects: number;
  activeProjects: number;
}

/** Valeurs par défaut de configuration */
export const DEFAULT_EXPERIMENT_CONFIG: ExperimentConfig = {
  sampleSize: 1000,
  confidenceLevel: 0.95,
  duration: 14,
  autoStop: false,
  allowReentry: false,
  persistAssignment: true
};

/** Type guard pour ExperimentStatus */
export function isValidExperimentStatus(value: unknown): value is ExperimentStatus {
  const validStatuses: ExperimentStatus[] = ['draft', 'scheduled', 'active', 'paused', 'completed', 'archived', 'cancelled'];
  return typeof value === 'string' && validStatuses.includes(value as ExperimentStatus);
}

/** Type guard pour ExperimentType */
export function isValidExperimentType(value: unknown): value is ExperimentType {
  const validTypes: ExperimentType[] = ['ab_test', 'multivariate', 'feature_flag', 'rollout', 'holdout', 'bandit'];
  return typeof value === 'string' && validTypes.includes(value as ExperimentType);
}

/** Calculer le taux de conversion */
export function calculateConversionRate(conversions: number, participants: number): number {
  if (participants === 0) return 0;
  return conversions / participants;
}

/** Calculer l'amélioration relative */
export function calculateImprovement(control: number, variant: number): number {
  if (control === 0) return 0;
  return ((variant - control) / control) * 100;
}

export default {
  DEFAULT_EXPERIMENT_CONFIG,
  isValidExperimentStatus,
  isValidExperimentType,
  calculateConversionRate,
  calculateImprovement
};
