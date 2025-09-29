import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { InstrumentCode, InstrumentItem } from '@/lib/assess/types';

interface AssessFormProps {
  instrument: InstrumentCode;
  items: InstrumentItem[];
  onSubmit: (responses: Record<string, number>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export function AssessForm({
  instrument,
  items,
  onSubmit,
  onCancel,
  isLoading = false,
  className = ""
}: AssessFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  
  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;
  const isLastItem = currentIndex === items.length - 1;
  const canProceed = responses[currentItem?.id] !== undefined;

  const handleResponse = (value: number) => {
    if (!currentItem) return;
    
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastItem) {
      onSubmit(responses);
    } else {
      setCurrentIndex(prev => Math.min(prev + 1, items.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (!currentItem) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Aucun élément d'évaluation disponible</p>
          <Button onClick={onCancel} variant="outline" className="mt-4">
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  const renderInput = () => {
    const currentValue = responses[currentItem.id];

    switch (currentItem.type) {
      case 'slider':
        return (
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={[currentValue || (currentItem.min || 0)]}
                onValueChange={([value]) => handleResponse(value)}
                min={currentItem.min || 0}
                max={currentItem.max || 10}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-4">
              <span>{currentItem.min || 0}</span>
              <span className="font-medium">{currentValue || (currentItem.min || 0)}</span>
              <span>{currentItem.max || 10}</span>
            </div>
          </div>
        );

      case 'choice':
        return (
          <RadioGroup
            value={currentValue?.toString()}
            onValueChange={(value) => handleResponse(parseInt(value))}
            className="space-y-3"
          >
            {currentItem.options?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`choice-${index}`} />
                <Label htmlFor={`choice-${index}`} className="flex-1 cursor-pointer">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'scale':
      default:
        const scaleMin = currentItem.min || 1;
        const scaleMax = currentItem.max || 5;
        
        return (
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: scaleMax - scaleMin + 1 }, (_, i) => {
              const value = scaleMin + i;
              const isSelected = currentValue === value;
              
              return (
                <Button
                  key={value}
                  variant={isSelected ? "default" : "outline"}
                  size="lg"
                  className={`h-12 text-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleResponse(value)}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <Card className={`assess-form ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} / {items.length}
          </Badge>
          <CardTitle className="text-lg">
            {instrument}
          </CardTitle>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-medium leading-relaxed">
            {currentItem.prompt}
          </h3>
          
          {currentItem.subscale && (
            <Badge variant="secondary" className="text-xs">
              {currentItem.subscale}
            </Badge>
          )}
        </div>

        <div className="py-4">
          {renderInput()}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={currentIndex === 0 ? onCancel : handlePrevious}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentIndex === 0 ? 'Annuler' : 'Précédent'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed || isLoading}
            className="min-w-24"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : isLastItem ? (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            {isLastItem ? 'Terminer' : 'Suivant'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}