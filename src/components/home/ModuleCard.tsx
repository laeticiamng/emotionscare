
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  statIcon?: React.ReactNode;
  statText?: string;
  statValue?: string | number;
  to: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  icon,
  title,
  description,
  statIcon,
  statText,
  statValue,
  to
}) => {
  return (
    <div className="bg-background/90 border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      {/* Statistique en haut si présente */}
      {statIcon && statText && (
        <div className="flex items-center gap-3 mb-4 text-primary">
          <span className="text-primary">{statIcon}</span>
          <span className="text-sm font-medium">
            {statText}: <strong>{statValue}</strong>
          </span>
        </div>
      )}
      
      {/* Icône et titre */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
      </div>
      
      {/* Description */}
      <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
      
      {/* Bouton d'action */}
      <Button 
        variant="outline" 
        className="mt-auto justify-between group" 
        asChild
      >
        <Link to={to}>
          <span>Accéder</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  );
};

export default ModuleCard;
