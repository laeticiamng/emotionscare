
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
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
  period: 'day' | 'week' | 'month' | 'year';
  setPeriod: (period: 'day' | 'week' | 'month' | 'year') => void;
}
