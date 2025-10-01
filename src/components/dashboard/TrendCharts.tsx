// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

interface TrendChartsProps {
  collapsed: boolean;
  onToggle: () => void;
  userId: string;
}

const TrendCharts: React.FC<TrendChartsProps> = ({
  collapsed,
  onToggle,
  userId
}) => {
  if (collapsed) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Tendances émotionnelles
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Tendances émotionnelles
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
          Graphique de tendance émotionnelle
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCharts;
