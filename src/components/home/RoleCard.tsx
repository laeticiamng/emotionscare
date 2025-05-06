
import React from 'react';
import { LucideIcon } from 'lucide-react';
import FeatureList from './FeatureList';
import CallToAction from './CallToAction';

interface RoleCardProps {
  title: string;
  icon: LucideIcon;
  features: string[];
  type: 'user' | 'admin';
}

const RoleCard: React.FC<RoleCardProps> = ({ title, icon: Icon, features, type }) => {
  return (
    <div className="card-premium hover-grow">
      <div className="flex flex-col items-center p-8 md:p-10">
        <div className="p-6 rounded-full bg-primary/10 mb-6">
          <Icon size={48} className="text-primary" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 heading-elegant text-balance">
          {title}
        </h2>
        
        <FeatureList items={features} />
        
        <CallToAction type={type} />
      </div>
    </div>
  );
};

export default RoleCard;
