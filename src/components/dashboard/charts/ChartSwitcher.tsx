// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, PieChart, LineChart, Filter, Download } from 'lucide-react';
import { SegmentContextType, SegmentDimension, SegmentOption } from '@/types/segment';
import { useSegment } from '@/contexts/SegmentContext';

interface ChartSwitcherProps {
  title: string;
  description?: string;
  data?: any[];
  dimensions?: SegmentDimension[];
  className?: string;
  allowDownload?: boolean;
  allowFiltering?: boolean;
}

const ChartSwitcher: React.FC<ChartSwitcherProps> = ({
  title,
  description,
  data = [],
  dimensions = [],
  className = '',
  allowDownload = true,
  allowFiltering = true,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(null);
  const segmentContext = useSegment();

  // Define default context handlers with correct type signatures
  const defaultContextHandlers: Partial<SegmentContextType> = {
    dimensions: [] as SegmentDimension[],
    setSelectedDimension: () => {},
    setSelectedOption: () => {},
  };

  // Use either context or defaults
  const {
    dimensions: contextDimensions,
    setSelectedDimension,
    setSelectedOption
  } = segmentContext || defaultContextHandlers;

  // If dimensions are provided in props, use them instead of context
  const availableDimensions = dimensions.length > 0 ? dimensions : (contextDimensions || []);

  const handleDimensionChange = (value: string) => {
    setSelectedDimensionId(value);
    
    // Find the full dimension object
    const dimension = availableDimensions.find(d => d.id === value);
    if (dimension && setSelectedDimension) {
      setSelectedDimension(dimension);
    }
  };

  const handleOptionChange = (value: string) => {
    // Find the full option object
    if (!selectedDimensionId) return;
    
    const dimension = availableDimensions.find(d => d.id === selectedDimensionId);
    if (!dimension) return;
    
    const option = dimension.options.find(o => o.value === value);
    
    if (option && setSelectedOption) {
      setSelectedOption(option);
    }
  };

  const getCurrentDimensionOptions = (): SegmentOption[] => {
    if (!selectedDimensionId) return [];
    const dimension = availableDimensions.find(d => d.id === selectedDimensionId);
    return dimension ? dimension.options : [];
  };

  const charts = [
    { id: 'bar', label: 'Barres', icon: <BarChart className="h-4 w-4" /> },
    { id: 'line', label: 'Ligne', icon: <LineChart className="h-4 w-4" /> },
    { id: 'pie', label: 'Camembert', icon: <PieChart className="h-4 w-4" /> },
  ];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {allowFiltering && (
            <Select onValueChange={handleDimensionChange}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                {availableDimensions.map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.label || dim.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {allowDownload && (
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedDimensionId && getCurrentDimensionOptions().length > 0 && (
          <div className="mb-4">
            <Select onValueChange={handleOptionChange}>
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Choisir une option" />
              </SelectTrigger>
              <SelectContent>
                {getCurrentDimensionOptions().map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Tabs defaultValue="bar" value={chartType} onValueChange={(v) => setChartType(v as 'bar' | 'line' | 'pie')}>
          <TabsList className="grid w-full grid-cols-3 h-9">
            {charts.map(chart => (
              <TabsTrigger 
                key={chart.id} 
                value={chart.id}
                className="flex items-center gap-1.5"
              >
                {chart.icon}
                <span className="hidden sm:inline-block">{chart.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="bar" className="pt-4 h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">
              Graphique à barres (données de démonstration)
            </div>
          </TabsContent>
          
          <TabsContent value="line" className="pt-4 h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">
              Graphique linéaire (données de démonstration)
            </div>
          </TabsContent>
          
          <TabsContent value="pie" className="pt-4 h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">
              Graphique en camembert (données de démonstration)
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartSwitcher;
