
import React from 'react';
import ModuleCard from './ModuleCard';
import { Eye, Users, User, Brain, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ModulesSectionProps {
  collapsed?: boolean;
  onToggle?: () => void;
  showHeading?: boolean;  // Add this prop to fix the error
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ 
  collapsed = false, 
  onToggle,
  showHeading = true  // Default to true
}) => {
  const modules = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel et obtenez des insights personnalisés",
      statIcon: <Eye className="w-5 h-5" />,
      statText: "Dernier scan",
      statValue: "aujourd'hui",
      to: "/scan"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Social Cocoon",
      description: "Échangez anonymement avec vos collègues dans un espace bienveillant",
      statIcon: <Users className="w-5 h-5" />,
      statText: "Nouveaux messages",
      statValue: 2,
      to: "/social-cocoon"
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Buddy",
      description: "Connexions de confiance avec des collègues pour un soutien mutuel",
      statIcon: <User className="w-5 h-5" />,
      statText: "Connexions",
      statValue: 3,
      to: "/buddy"
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Coach IA",
      description: "Conseils personnalisés par une IA émotionnelle bienveillante",
      statIcon: <Brain className="w-5 h-5" />,
      statText: "Recommandation",
      statValue: 4,
      to: "/coach"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Gamification",
      description: "Relevez des défis quotidiens et gagnez des récompenses",
      statIcon: <Trophy className="w-5 h-5" />,
      statText: "Badges gagnés",
      statValue: 3,
      to: "/gamification"
    }
  ];

  return (
    <div className="card-premium p-6 lg:p-8 animate-fade-in">
      <div 
        className="flex justify-between items-center cursor-pointer mb-6"
        onClick={onToggle}
      >
        <h2 className="text-2xl font-semibold heading-elegant">Modules</h2>
        {onToggle && (
          <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
            {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </Button>
        )}
      </div>
      
      {!collapsed && (
        <>
          {showHeading && <h3 className="text-xl font-medium mb-6">Navigation rapide</h3>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                {...module}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModulesSection;
