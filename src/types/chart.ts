
/**
 * Configuration for charts
 */
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
  options?: any;
}

/**
 * Props for chart context
 */
export interface ChartContextProps {
  defaultConfig: ChartConfig;
  createChart: (canvas: HTMLCanvasElement, config: ChartConfig) => any;
  updateChart: (chart: any, config: ChartConfig) => void;
  destroyChart: (chart: any) => void;
}
