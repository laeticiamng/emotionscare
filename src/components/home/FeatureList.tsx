
import React from 'react';
import { Check } from 'lucide-react';

interface FeatureListProps {
  items: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ items }) => {
  return (
    <ul className="space-y-6 mb-10 w-full max-w-md mx-auto">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 text-[1.05rem]">
          <span className="rounded-full bg-primary/15 p-2 mt-0.5 flex-shrink-0 shadow-sm">
            <Check size={18} className="text-primary" strokeWidth={2.5} />
          </span>
          <span className="text-foreground text-balance font-medium">{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeatureList;
