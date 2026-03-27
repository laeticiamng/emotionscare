// @ts-nocheck
import React from 'react';
import { BookOpen, HeartPulse, Brain, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickNavGrid: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Journal',
      description: 'Exprimez vos pensées',
      icon: BookOpen,
      path: '/app/journal',
      bgClass: 'card-journal',
    },
    {
      title: 'Respiration',
      description: 'Sessions guidées',
      icon: HeartPulse,
      path: '/app/vr',
      bgClass: 'card-vr',
    },
    {
      title: 'Scan émotionnel',
      description: 'Analysez votre état',
      icon: Eye,
      path: '/app/scan',
      bgClass: 'card-coach',
    },
    {
      title: 'Coach IA',
      description: 'Conseils personnalisés',
      icon: Brain,
      path: '/app/scan',
      bgClass: 'card-coach',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {modules.map((module) => (
        <div
          key={module.title}
          className={`module-card ${module.bgClass} cursor-pointer`}
          onClick={() => navigate(module.path)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate(module.path); }}
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 rounded-full bg-white/50 backdrop-blur-sm mb-3">
              <module.icon className="h-6 w-6 text-cocoon-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{module.title}</h3>
            <p className="text-xs text-muted-foreground">{module.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickNavGrid;
