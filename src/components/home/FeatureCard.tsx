
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="card-premium p-8 text-center hover-lift shadow-premium h-full flex flex-col transition-all duration-300">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="font-medium text-xl mb-6 heading-elegant">{title}</h3>
      <p className="text-muted-foreground text-balance text-[1.05rem] leading-relaxed flex-1">{description}</p>
    </div>
  );
};

export default FeatureCard;
