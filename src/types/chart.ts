
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
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
}

export interface ChartContextProps {
  chartConfig: ChartConfig;
  setChartConfig: (config: ChartConfig) => void;
  updateData: (datasetIndex: number, data: number[]) => void;
  updateLabels: (labels: string[]) => void;
}
