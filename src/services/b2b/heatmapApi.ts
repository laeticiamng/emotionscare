// @ts-nocheck
import { fetchHeatmap, fetchHeatmapPeriods as fetchPeriods } from './suiteClient';

export interface HeatmapCell {
  team_id: string | null;
  team_label: string;
  instrument: string;
  summary: string;
}

export type HeatmapSummary = HeatmapCell;

export async function fetchHeatmapCells(params: { period: string }): Promise<HeatmapSummary[]> {
  const response = await fetchHeatmap(params);
  return response;
}

export async function fetchHeatmapPeriods(): Promise<string[]> {
  return fetchPeriods();
}
