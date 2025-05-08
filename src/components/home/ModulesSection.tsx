
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, FileText, Headphones, Video, MessageCircle, BarChart, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface ModulesSectionProps {
  showHeading?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ 
  showHeading = false,
  collapsed = false, 
  onToggle
}) => {
  const { isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);
  
  const modules = [
    {
      id: 'scan',
      title: 'Scan émotionnel',
      description: 'Analysez votre état émotionnel actuel',
      icon: <Heart className="h-5 w-5" />,
      path: '/scan',
      color: 'text-rose-500',
      bgColor: 'bg-rose-100',
    },
    {
      id: 'journal',
      title: 'Journal',
      description: 'Suivez votre progression émotionnelle',
      icon: <FileText className="h-5 w-5" />,
      path: '/journal',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'music',
      title: 'Musicothérapie',
      description: 'Améliorez votre humeur avec la musique',
      icon: <Headphones className="h-5 w-5" />,
      path: '/music',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'vr',
      title: 'VR Thérapie',
      description: 'Séances immersives de détente',
      icon: <Video className="h-5 w-5" />,
      path: '/vr',
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      id: 'coach',
      title: 'Coach IA',
      description: 'Conseils personnalisés pour votre bien-être',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/coach',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
    },
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      description: 'Visualisez vos données et votre progression',
      icon: <BarChart className="h-5 w-5" />,
      path: '/dashboard',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
    },
  ];

  const visibleModules = expanded ? modules : modules.slice(0, 3);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (collapsed) {
    return (
      <div className="my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Modules</h2>
          {onToggle && (
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <ChevronDown className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      {(showHeading || onToggle) && (
        <div className="flex justify-between items-center mb-6">
          {showHeading && <h2 className="text-2xl font-semibold">Modules</h2>}
          {onToggle && (
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <ChevronUp className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleModules.map((module) => (
          <Card key={module.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className={cn("p-4 flex flex-row items-center gap-3", module.bgColor)}>
              <div className={cn("p-2 rounded-full", module.bgColor)}>
                {React.cloneElement(module.icon, { className: cn("h-5 w-5", module.color) })}
              </div>
              <div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription>{module.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4">
              <Button asChild variant="outline" className="w-full">
                <Link to={isAuthenticated ? module.path : "/login"}>
                  {isAuthenticated ? 'Accéder' : 'Connexion requise'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {modules.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={toggleExpand}>
            {expanded ? 'Voir moins' : 'Voir tous les modules'}
            {expanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModulesSection;
