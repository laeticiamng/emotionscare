/**
 * B2B Feature Module
 * Exports all B2B-related types, components, and API functions
 */

// Types
export * from './types';

// API
export * from './api';

// Components
export * from './components';

// Report components
export { ActionSuggestion } from './reports/ActionSuggestion';
export { B2BHeatmap } from './reports/B2BHeatmap';
export { ExportButton } from './reports/ExportButton';

// Narrative utils
export { generateMonthlyNarrative } from './reports/narrative';
export type { MonthlyNarrative, NarrativeTone } from './reports/narrative';

// Heatmap utils
export {
  labelInstrument,
  mapSummariesToCells,
  deriveHeatmapInsight,
  deriveActionSuggestion,
  groupCellsByInstrument
} from './reports/utils';
export type { HeatmapCell, HeatmapTone, HeatmapInsight } from './reports/utils';
