
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlobalOverviewTabProps, KpiCardProps } from '@/types';
import KpiCardsGrid from '../../KpiCardsGrid';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ 
  period: initialPeriod = 'week',
  segment: initialSegment = 'all',
  filterBy: initialFilterBy = 'all',
  className,
  onPeriodChange
}) => {
  const [period, setPeriod] = useState(initialPeriod);
  const [segment, setSegment] = useState(initialSegment);
  const [filterBy, setFilterBy] = useState(initialFilterBy);
  const [completion, setCompletion] = useState(75);
  const [productivity, setProductivity] = useState(60);
  const [emotionalScore, setEmotionalScore] = useState(80);
  
  useEffect(() => {
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  }, [period, onPeriodChange]);
  
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };
  
  const handleSegmentChange = (newSegment: string) => {
    setSegment(newSegment);
  };
  
  const handleFilterByChange = (newFilterBy: string) => {
    setFilterBy(newFilterBy);
  };
  
  const kpiCards: KpiCardProps[] = [
    { 
      id: 'completion', 
      title: 'Taux de complétion', 
      value: `${completion}%`, 
      delta: { value: 12, trend: 'up' as const }, 
      status: 'success' as const 
    },
    { 
      id: 'productivity', 
      title: 'Productivité', 
      value: `${productivity}%`, 
      delta: { value: -5, trend: 'down' as const }, 
      status: 'warning' as const 
    },
    { 
      id: 'emotionalScore', 
      title: 'Score émotionnel', 
      value: `${emotionalScore}%`, 
      delta: { value: 8, trend: 'up' as const }, 
      status: 'success' as const 
    },
  ];
  
  return (
    <div className={className}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Aperçu Global</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={period} className="w-full">
            <TabsList>
              <TabsTrigger value="day" onClick={() => handlePeriodChange('day')}>Aujourd'hui</TabsTrigger>
              <TabsTrigger value="week" onClick={() => handlePeriodChange('week')}>Cette semaine</TabsTrigger>
              <TabsTrigger value="month" onClick={() => handlePeriodChange('month')}>Ce mois-ci</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
              <div>
                <KpiCardsGrid cards={kpiCards} />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Progression quotidienne
                  </p>
                  <Progress value={55} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="week">
              <div>
                <KpiCardsGrid cards={kpiCards} />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Progression hebdomadaire
                  </p>
                  <Progress value={75} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="month">
              <div>
                <KpiCardsGrid cards={kpiCards} />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Progression mensuelle
                  </p>
                  <Progress value={90} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalOverviewTab;
