// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pattern } from '@/store/breath.store';

interface PatternPickerProps {
  value: Pattern;
  onChange: (pattern: Pattern) => void;
}

const PATTERN_INFO = {
  '4-6-8': {
    name: '4-6-8',
    description: 'Inspire 4s • Retiens 6s • Expire 8s',
    benefits: 'Relaxation profonde'
  },
  '5-5': {
    name: '5-5',
    description: 'Inspire 5s • Expire 5s',
    benefits: 'Équilibrage simple'
  },
  '4-2-4': {
    name: '4-2-4', 
    description: 'Inspire 4s • Retiens 2s • Expire 4s',
    benefits: 'Cohérence cardiaque'
  }
} as const;

export const PatternPicker: React.FC<PatternPickerProps> = ({
  value,
  onChange
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Choisis ton rythme</h3>
        
        <div 
          className="space-y-2"
          role="radiogroup" 
          aria-label="Pattern de respiration"
        >
          {(Object.keys(PATTERN_INFO) as Pattern[]).map((pattern) => {
            const info = PATTERN_INFO[pattern];
            const isSelected = value === pattern;
            
            return (
              <Button
                key={pattern}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start h-auto p-3"
                onClick={() => onChange(pattern)}
                role="radio"
                aria-checked={isSelected}
                aria-labelledby={`pattern-${pattern}-label`}
                aria-describedby={`pattern-${pattern}-desc`}
              >
                <div className="text-left">
                  <div 
                    id={`pattern-${pattern}-label`}
                    className="font-medium"
                  >
                    {info.name}
                  </div>
                  <div 
                    id={`pattern-${pattern}-desc`}
                    className="text-sm opacity-80"
                  >
                    {info.description}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {info.benefits}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};