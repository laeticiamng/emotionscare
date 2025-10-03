
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, FileText, Headphones, Video, MessageCircle, ArrowRight, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const TherapyModules: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const modules = [
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel actuel par texte ou par reconnaissance vocale",
      icon: Heart,
      color: "text-rose-500",
      bgColor: "bg-rose-100",
      path: "/scan",
      badge: "Populaire"
    },
    {
      title: "Journal",
      description: "Suivez l'évolution de vos émotions et gardez une trace de vos ressentis",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      path: "/journal"
    },
    {
      title: "Musicothérapie",
      description: "Écoutez de la musique adaptée à votre état émotionnel pour vous aider",
      icon: Headphones,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      path: "/music",
      badge: "IA"
    },
    {
      title: "VR thérapie",
      description: "Immergez-vous dans des environnements adaptés à votre humeur",
      icon: Video,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      path: "/vr"
    },
    {
      title: "Coach IA",
      description: "Recevez des conseils personnalisés sur la gestion des émotions",
      icon: MessageCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      path: "/coach",
      badge: "Nouveau"
    },
    {
      title: "Tableau de bord",
      description: "Visualisez et analysez vos données émotionnelles",
      icon: BarChart,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      path: "/dashboard"
    }
  ];
  
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in">Nos modules thérapeutiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const ModuleIcon = module.icon;
          
          return (
            <div 
              key={module.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 animate-fade-in hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${module.bgColor} p-3 rounded-lg transition-transform duration-300 group-hover:scale-110`}>
                  <ModuleIcon className={`h-6 w-6 ${module.color} transition-transform duration-300`} />
                </div>
                {module.badge && (
                  <Badge variant="outline" className="font-normal animate-pulse">
                    {module.badge}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 overflow-hidden group-hover:bg-primary/10"
                onClick={() => navigate(isAuthenticated ? module.path : "/login")}
              >
                {isAuthenticated ? 'Accéder' : 'Connexion requise'}
                <ArrowRight className="h-4 w-4 ml-2 inline transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TherapyModules;
