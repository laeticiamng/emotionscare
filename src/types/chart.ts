// @ts-nocheck

import { ReactNode } from 'react';

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }>;
  };
  options?: any;
  height?: number;
  width?: number;
}

export interface ChartContextProps {
  chartConfig: ChartConfig;
  setChartConfig: (config: ChartConfig) => void;
  refreshChart: () => void;
  loading: boolean;
  error: Error | null;
  children?: ReactNode;
}
