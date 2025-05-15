
import React from 'react';

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'scatter';
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
  options?: Record<string, any>;
}

export interface ChartContextProps {
  chartConfigs: Record<string, ChartConfig>;
  addChartConfig: (id: string, config: ChartConfig) => void;
  removeChartConfig: (id: string) => void;
  updateChartConfig: (id: string, config: Partial<ChartConfig>) => void;
  getChartConfig: (id: string) => ChartConfig | undefined;
}
