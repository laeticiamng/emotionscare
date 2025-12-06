// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';
import { Segment } from '@/store/marketing.store';

interface SegmentSwitchProps {
  value: Segment;
  onChange: (segment: Segment) => void;
}

/**
 * Switch pour choisir entre segment B2C et B2B
 */
export const SegmentSwitch: React.FC<SegmentSwitchProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={value === 'b2c' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('b2c')}
        className="flex items-center gap-2 text-sm"
        aria-pressed={value === 'b2c'}
      >
        <User className="w-4 h-4" />
        Particulier
      </Button>
      
      <Button
        variant={value === 'b2b' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('b2b')}
        className="flex items-center gap-2 text-sm"
        aria-pressed={value === 'b2b'}
      >
        <Building className="w-4 h-4" />
        Entreprise
      </Button>
    </div>
  );
};