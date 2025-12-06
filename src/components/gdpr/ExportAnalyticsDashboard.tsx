import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, FileText, Download, HardDrive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function ExportAnalyticsDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['export-analytics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('export_logs')
        .select('format, file_size, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const formatCounts = { pdf: 0, excel: 0, json: 0, csv: 0 };
      let totalSize = 0;
      
      data?.forEach(log => {
        formatCounts[log.format as keyof typeof formatCounts]++;
        totalSize += log.file_size || 0;
      });

      return {
        total: data?.length || 0,
        formatCounts,
        avgSize: data?.length ? totalSize / data.length : 0,
        totalSize,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exports Totaux</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Format Populaire</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? Object.entries(stats.formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0].toUpperCase() : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taille Moyenne</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? (stats.avgSize / 1024).toFixed(1) : 0} KB
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stocké</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? (stats.totalSize / (1024 * 1024)).toFixed(1) : 0} MB
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribution par Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats && Object.entries(stats.formatCounts).map(([format, count]) => (
              <div key={format} className="flex items-center gap-2">
                <div className="w-20 text-sm font-medium">{format.toUpperCase()}</div>
                <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(count / Math.max(stats.total, 1)) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-muted-foreground">{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
