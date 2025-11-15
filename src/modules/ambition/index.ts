/**
 * Module Ambition
 * Système complet de gestion d'objectifs gamifiés
 *
 * Modes disponibles :
 * - Standard : Gestion classique d'objectifs et quêtes
 * - Arcade : Génération IA de structure de jeu
 *
 * @module ambition
 */

// ============================================================================
// COMPOSANTS
// ============================================================================

export { AmbitionPage } from './components/AmbitionPage';
export { default as AmbitionPageDefault } from './components/AmbitionPage';

// ============================================================================
// SERVICES
// ============================================================================

export {
  // Runs
  createRun,
  updateRun,
  getRunComplete,
  fetchRuns,
  fetchActiveRuns,
  deleteRun,

  // Quests
  createQuest,
  updateQuest,
  completeQuest,
  fetchQuests,
  deleteQuest,

  // Artifacts
  createArtifact,
  fetchArtifacts,

  // Stats & Analytics
  getStats,
  getUserHistory,

  // AI Generation
  generateGameStructure,

  // Default export
  ambitionService,
  default as ambitionServiceDefault,
} from './ambitionService';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Enums
  AmbitionRunStatus,
  QuestStatus,
  QuestResult,
  ArtifactRarity,
  RunDifficulty,
  AmbitionMode,
  SortOption,

  // Entities
  AmbitionRun,
  AmbitionQuest,
  AmbitionArtifact,

  // Aggregates
  RunStats,
  AmbitionRunComplete,
  UserAmbitionHistory,

  // Payloads
  CreateAmbitionRun,
  UpdateAmbitionRun,
  CreateQuest,
  UpdateQuest,
  CreateArtifact,

  // AI Generation
  GenerateGameStructure,
  GameStructure,

  // Interfaces
  AmbitionStats,
  RunFilters,
} from './types';

// ============================================================================
// SCHEMAS ZOD
// ============================================================================

export {
  // Enums Schemas
  AmbitionRunStatus as AmbitionRunStatusSchema,
  QuestStatus as QuestStatusSchema,
  QuestResult as QuestResultSchema,
  ArtifactRarity as ArtifactRaritySchema,
  RunDifficulty as RunDifficultySchema,

  // Entity Schemas
  AmbitionRun as AmbitionRunSchema,
  AmbitionQuest as AmbitionQuestSchema,
  AmbitionArtifact as AmbitionArtifactSchema,

  // Aggregate Schemas
  RunStats as RunStatsSchema,
  AmbitionRunComplete as AmbitionRunCompleteSchema,
  UserAmbitionHistory as UserAmbitionHistorySchema,

  // Payload Schemas
  CreateAmbitionRun as CreateAmbitionRunSchema,
  UpdateAmbitionRun as UpdateAmbitionRunSchema,
  CreateQuest as CreateQuestSchema,
  UpdateQuest as UpdateQuestSchema,
  CreateArtifact as CreateArtifactSchema,

  // AI Schemas
  GenerateGameStructure as GenerateGameStructureSchema,
  GameStructure as GameStructureSchema,
} from './types';
