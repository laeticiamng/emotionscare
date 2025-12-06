
import React from 'react';
import { Eye, BookOpen, Users, Star, HeartPulse, Brain, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const QuickNavGrid: React.FC = () => {
  const navigate = useNavigate();
  
  const modules = [
    {
      title: 'Journal',
      description: 'Exprimez vos pensées',
      icon: BookOpen,
      path: '/journal',
      bgClass: 'card-journal',
      indicator: 'Dernière entrée: hier'
    },
    {
      title: 'Micro-pauses VR',
      description: 'Sessions immersives',
      icon: HeartPulse,
      path: '/vr-session',
      bgClass: 'card-vr',
      indicator: 'Sessions cette semaine: 3'
    },
    {
      title: 'Social Cocoon',
      description: 'Échangez anonymement',
      icon: Users,
      path: '/community',
      bgClass: 'card-social',
      indicator: 'Nouveaux messages: 2'
    },
    {
      title: 'Coach IA',
      description: 'Conseils personnalisés',
      icon: Brain,
      path: '/scan',
      bgClass: 'card-coach',
      indicator: 'Recommandations: 4'
    },
    {
      title: 'Scan émotionnel',
      description: 'Analysez votre état',
      icon: Eye,
      path: '/scan',
      bgClass: 'card-coach',
      indicator: 'Dernier scan: aujourd\'hui'
    },
    {
      title: 'Gamification',
      description: 'Relevez des défis',
      icon: Star,
      path: '/gamification',
      bgClass: 'card-analytics',
      indicator: 'Badges gagnés: 3'
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module, index) => (
        <div 
          key={module.title}
          className={`module-card ${module.bgClass} cursor-pointer`}
          onClick={() => navigate(module.path)}
          style={{ animationDelay: `${0.1 * index}s` }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm">
                <module.icon className="h-6 w-6 text-cocoon-600" />
              </div>
              
              <div className="text-xs font-medium text-cocoon-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                {module.indicator}
              </div>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
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

export default QuickNavGrid;
