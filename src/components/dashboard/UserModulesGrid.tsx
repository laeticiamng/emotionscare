
import React from 'react';
import { Eye, Users, Star, Brain, ArrowRight, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const UserModulesGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const modules = [
    {
      title: 'Scan émotionnel',
      description: 'Analysez votre état',
      icon: Eye,
      path: '/scan',
      bgClass: 'bg-pastel-blue/30',
      indicator: 'Dernier scan: aujourd\'hui'
    },
    {
      title: 'Social Cocoon',
      description: 'Échangez anonymement',
      icon: Users,
      path: '/social-cocoon',
      bgClass: 'bg-pastel-purple/30',
      indicator: 'Nouveaux messages: 2'
    },
    {
      title: 'Buddy',
      description: 'Connexions de confiance',
      icon: User,
      path: '/buddy',
      bgClass: 'bg-pastel-orange/30', 
      indicator: 'Connexions: 3'
    },
    {
      title: 'Coach IA',
      description: 'Conseils personnalisés',
      icon: Brain,
      path: '/coach',
      bgClass: 'bg-pastel-green/30',
      indicator: 'Recommandations: 4'
    },
    {
      title: 'Gamification',
      description: 'Relevez des défis',
      icon: Star,
      path: '/gamification',
      bgClass: 'bg-pastel-orange/30',
      indicator: 'Badges gagnés: 3'
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {modules.map((module, index) => (
        <div 
          key={module.title}
          className={`module-card ${module.bgClass} cursor-pointer rounded-3xl shadow-soft hover:shadow-medium border border-white/50 p-4 transition-all duration-300 hover:translate-y-[-4px]`}
          onClick={() => navigate(module.path)}
          style={{ animationDelay: `${0.1 * index}s` }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-full bg-white/50 backdrop-blur-sm">
                <module.icon className="h-6 w-6 text-cocoon-600" />
              </div>
              
              <div className="text-xs font-medium text-cocoon-700 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
                {module.indicator}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="ghost" 
                className="rounded-full px-4 py-1 text-sm hover:bg-white/80 border border-transparent hover:border-cocoon-200"
              >
                Accéder <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserModulesGrid;
