import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface K6Metrics {
  timestamp: string;
  function_name: string;
  http_req_duration_p95: number;
  http_req_duration_p99: number;
  http_req_failed_rate: number;
  data_received_rate: number;
  data_sent_rate: number;
}

interface K6MetricsChartProps {
  metrics: K6Metrics[];
  type: 'latency' | 'errors' | 'throughput';
}

export function K6MetricsChart({ metrics, type }: K6MetricsChartProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const labels = sortedMetrics.map(m => 
    new Date(m.timestamp).toLocaleString('fr-FR', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  );

  let datasets: any[] = [];

  if (type === 'latency') {
    datasets = [
      {
        label: 'P95 Latence (ms)',
        data: sortedMetrics.map(m => m.http_req_duration_p95),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'P99 Latence (ms)',
        data: sortedMetrics.map(m => m.http_req_duration_p99),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ];
  } else if (type === 'errors') {
    datasets = [
      {
        label: 'Taux d\'erreur (%)',
        data: sortedMetrics.map(m => m.http_req_failed_rate * 100),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ];
  } else if (type === 'throughput') {
    datasets = [
      {
        label: 'Données reçues (KB/s)',
        data: sortedMetrics.map(m => m.data_received_rate / 1024),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Données envoyées (KB/s)',
        data: sortedMetrics.map(m => m.data_sent_rate / 1024),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ];
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <div className="h-64">
      <Line options={options} data={data} />
    </div>
  );
}
