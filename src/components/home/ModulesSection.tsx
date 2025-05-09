import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Music, Headset, MessagesSquare, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleCard from '@/components/home/ModuleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface ModulesSectionProps {
  showHeading?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  selectedMood?: string | null;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  showHeading = false,
  collapsed = false,
  onToggle,
  selectedMood
}) => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsCollapsed(prev => !prev);
    }
  };
  
  // Base modules data
  const baseModules = [
    {
      title: "Journal émotionnel",
      description: "Notez vos pensées et suivez votre évolution émotionnelle au fil du temps",
      icon: <BookOpen className="h-5 w-5" />,
      to: isAuthenticated ? "/journal" : "/login?redirect=/journal",
      statIcon: <Activity className="h-4 w-4" />,
      statText: "Progression",
      statValue: "7 jours",
      priority: 5
    },
    {
      title: "Musique thérapeutique",
      description: "Écoutez ou créez de la musique adaptée à votre état émotionnel",
      icon: <Music className="h-5 w-5" />,
      to: isAuthenticated ? "/music" : "/login?redirect=/music",
      statIcon: <Activity className="h-4 w-4" />,
      statText: "Pistes écoutées",
      statValue: "12",
      priority: 4
    },
    {
      title: "Coach émotionnel",
      description: "Discutez avec notre coach IA pour obtenir des conseils personnalisés",
      icon: <MessagesSquare className="h-5 w-5" />,
      to: isAuthenticated ? "/coach" : "/login?redirect=/coach",
      statIcon: <Activity className="h-4 w-4" />,
      statText: "Dernière session",
      statValue: "Hier",
      priority: 3
    },
    {
      title: "Séances VR",
      description: "Immergez-vous dans des expériences relaxantes en réalité virtuelle",
      icon: <Headset className="h-5 w-5" />,
      to: isAuthenticated ? "/vr" : "/login?redirect=/vr",
      statIcon: <Activity className="h-4 w-4" />,
      statText: "Sessions",
      statValue: "3",
      priority: 2
    },
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel actuel pour des recommandations adaptées",
      icon: <Brain className="h-5 w-5" />,
      to: isAuthenticated ? "/scan" : "/login?redirect=/scan",
      statIcon: <Activity className="h-4 w-4" />,
      statText: "Dernier scan",
      statValue: "Aujourd'hui",
      priority: 1
    }
  ];

  // Reorder modules based on mood
  const getModulesByMood = () => {
    if (!selectedMood) return baseModules;
    
    let prioritizedModules = [...baseModules];
    
    // Adjust priorities based on mood
    switch (selectedMood) {
      case 'calm':
        // When calm, suggest journal and VR
        prioritizedModules = prioritizedModules.map(module => ({
          ...module,
          priority: module.title.includes("Journal") ? 10 : 
                    module.title.includes("VR") ? 9 : 
                    module.priority
        }));
        break;
      case 'energetic':
        // When energetic, suggest music and coach
        prioritizedModules = prioritizedModules.map(module => ({
          ...module,
          priority: module.title.includes("Musique") ? 10 : 
                    module.title.includes("Coach") ? 9 : 
                    module.priority
        }));
        break;
      case 'creative':
        // When creative, suggest music and journal
        prioritizedModules = prioritizedModules.map(module => ({
          ...module,
          priority: module.title.includes("Musique") ? 10 : 
                    module.title.includes("Journal") ? 9 : 
                    module.priority
        }));
        break;
      case 'reflective':
        // When reflective, suggest journal and coach
        prioritizedModules = prioritizedModules.map(module => ({
          ...module,
          priority: module.title.includes("Journal") ? 10 : 
                    module.title.includes("Coach") ? 9 : 
                    module.priority
        }));
        break;
      case 'anxious':
        // When anxious, suggest scan and VR
        prioritizedModules = prioritizedModules.map(module => ({
          ...module,
          priority: module.title.includes("Scan") ? 10 : 
                    module.title.includes("VR") ? 9 : 
                    module.priority
        }));
        break;
      default:
        // Keep default order
        break;
    }
    
    // Sort by priority (higher number = higher priority)
    return prioritizedModules.sort((a, b) => b.priority - a.priority);
  };
  
  const modules = getModulesByMood();
  
  return (
    <section className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        {showHeading ? (
          <h2 className="text-2xl font-semibold">Nos modules</h2>
        ) : (
          <h2 className="text-xl font-semibold">Modules recommandés</h2>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggle} 
          className="h-9 w-9 p-0"
        >
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Button>
      </div>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ModuleCard
                    title={module.title}
                    description={module.description}
                    icon={module.icon}
                    to={module.to}
                    statIcon={module.statIcon}
                    statText={module.statText}
                    statValue={module.statValue}
                  />
                </motion.div>
              ))}
            </div>
            
            {selectedMood && (
              <motion.div 
                className="mt-6 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Modules recommandés selon votre humeur actuelle: <span className="font-medium text-primary">{selectedMood}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ModulesSection;
