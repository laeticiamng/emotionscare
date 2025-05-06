
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureListProps {
  items: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ items }) => {
  return (
    <ul className="space-y-4 mb-8 w-full max-w-xs">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="rounded-full bg-primary/10 p-1.5 mt-0.5 flex-shrink-0">
            <Check size={16} className="text-primary" />
          </span>
          <span className="text-foreground text-balance">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
