import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { 
  Calendar,
  Download,
  Eye,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  FileSpreadsheet,
  file,
  Mail,
  Settings,
  Users,
  Heart,
  Clock,
  Target,
  Award,
  Zap,
  BookOpen,
  MessageSquare,
  Headphones
} from 'lucide-react';
import { useReporting } from '@/contexts/ReportingContext';
import { ReportPrivacyBadge } from '@/components/reports/ReportPrivacyBadge';
import ReportDataCards from '@/components/reports/ReportDataCards';

interface ReportStats {
  emotionalScore: number;
  sessionsCompleted: number;
  progression: number;
}

interface Report {
  id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'quarterly';
  period: string;
  created_at: string;
  status: 'generated' | 'pending' | 'error';
  metrics: ReportStats;
  categories: string[];
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Rapport hebdomadaire - Semaine 12',
    type: 'weekly',
    period: '18-24 Mars 2024',
    created_at: '2024-03-25T10:00:00Z',
    status: 'generated',
    metrics: {
      emotionalScore: 78,
      sessionsCompleted: 12,
      progression: 85
    },
    categories: ['well-being', 'productivity', 'social']
  },
  {
    id: '2',
    title: 'Rapport mensuel - Mars 2024',
    type: 'monthly',
    period: 'Mars 2024',
    created_at: '2024-03-30T14:30:00Z',
    status: 'generated',
    metrics: {
      emotionalScore: 75,
      sessionsCompleted: 48,
      progression: 92
    },
    categories: ['well-being', 'goals', 'emotional-health']
  },
  {
    id: '3',
    title: 'Rapport trimestriel - Q1 2024',
    type: 'quarterly',
    period: 'Janvier - Mars 2024',
    created_at: '2024-03-31T09:15:00Z',
    status: 'pending',
    metrics: {
      emotionalScore: 72,
      sessionsCompleted: 142,
      progression: 88
    },
    categories: ['well-being', 'productivity', 'social', 'goals']
  }
];

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  
  const { loadData, exportReport, isLoading } = useReporting();

  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesType = selectedType === 'all' || report.type === selectedType;
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchTerm]);

  const handleExportReport = async (reportId: string, format: string) => {
    await exportReport(format);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      generated: 'default',
      pending: 'secondary',
      error: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status === 'generated' ? 'Généré' : 
         status === 'pending' ? 'En cours' : 'Erreur'}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'monthly': return <BarChart3 className="h-4 w-4" />;
      case 'quarterly': return <LineChart className="h-4 w-4" />;
      default: return <file className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports et Analytics</h1>
          <p className="text-muted-foreground">
            Consultez vos rapports de progression et exportez vos données personnelles
          </p>
        </div>
        
        <ReportPrivacyBadge />
      </div>

      {/* Period Selection & Data Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['week', 'month', 'quarter'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedPeriod(period);
                  loadData(period);
                }}
                className="capitalize"
              >
                {period === 'week' ? 'Semaine' : 
                 period === 'month' ? 'Mois' : 'Trimestre'}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => exportReport('pdf')} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <file className="h-4 w-4" />
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportReport('csv')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <ReportDataCards period={selectedPeriod} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Rechercher un rapport..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type de rapport</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Période</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Rapports disponibles</h2>
        
        <AnimatePresence mode="wait">
          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun rapport trouvé</h3>
                  <p className="text-muted-foreground text-center">
                    Aucun rapport ne correspond à vos critères de recherche.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {getTypeIcon(report.type)}
                            <div>
                              <h3 className="font-semibold text-lg">{report.title}</h3>
                              <p className="text-muted-foreground">{report.period}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {report.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-rose-500" />
                              <span>{report.metrics.emotionalScore}% bien-être</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-500" />
                              <span>{report.metrics.sessionsCompleted} sessions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              <span>{report.metrics.progression}% progression</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-3">
                          {getStatusBadge(report.status)}
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExportReport(report.id, 'pdf')}
                              disabled={report.status !== 'generated'}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Créé le {new Date(report.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsPage;
