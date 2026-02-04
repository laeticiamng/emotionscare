/**
 * Feature: RH Heatmap
 * Visualisation agrégée du bien-être organisationnel
 */

// Service
export { rhHeatmapService, default } from './rhHeatmapService';
export type {
  HeatmapCell,
  HeatmapRow,
  HeatmapData,
  HeatmapFilters,
  TeamAlert
} from './rhHeatmapService';

// Components
export { HeatmapGrid } from './components/HeatmapGrid';
export { TeamAlertsPanel } from './components/TeamAlertsPanel';
