
import React from 'react';
import { LucideIcon } from 'lucide-react';
import FeatureList from './FeatureList';
import CallToAction from './CallToAction';

interface RoleCardProps {
  title: string;
  icon: LucideIcon;
  features: string[];
  type: 'personal' | 'business';  
}

const RoleCard: React.FC<RoleCardProps> = ({ title, icon: Icon, features, type }) => {
  return (
    <div className="card-premium hover:transform hover:scale-[1.01] transition-all duration-300 shadow-premium h-full group">
      <div className="flex flex-col items-center p-8 md:p-10 h-full">
        <div className="p-6 rounded-full bg-primary/15 mb-7 shadow-sm group-hover:bg-primary/20 transition-colors">
          <Icon size={56} className="text-primary" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 heading-elegant text-balance text-center">
          {title}
        </h2>
        
        <FeatureList items={features} />
        
        <div className="mt-auto pt-6 w-full">
          <CallToAction type={type} />
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
