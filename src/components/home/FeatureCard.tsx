
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="card-premium p-6 text-center hover-lift">
      <h3 className="font-medium text-xl mb-3 heading-elegant">{title}</h3>
      <p className="text-muted-foreground text-balance">{description}</p>
    </div>
  );
};

export default FeatureCard;
