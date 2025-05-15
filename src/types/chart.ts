
export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
}

export interface ChartContextProps {
  activeCharts: string[];
  toggleChart: (chartId: string) => void;
  isChartActive: (chartId: string) => boolean;
  chartConfigs: ChartConfig[];
  updateChartConfig: (chartId: string, config: Partial<ChartConfig>) => void;
}
