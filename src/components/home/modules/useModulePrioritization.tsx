import React, { useMemo } from 'react';
import { BookOpen, Music, Headset, MessagesSquare, Brain, Activity } from 'lucide-react';

interface ModuleData {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  statIcon: React.ReactNode;
  statText: string;
  statValue: string | number;
  priority: number;
}

export const useModulePrioritization = (isAuthenticated: boolean, selectedMood: string | null) => {
  // Base modules data
  const baseModules = useMemo(() => [
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
  ], [isAuthenticated]);

  const prioritizedModules = useMemo(() => {
    if (!selectedMood) return baseModules;
    
    let modulesToPrioritize = [...baseModules];
    
    // Adjust priorities based on mood
    switch (selectedMood) {
      case 'calm':
        // When calm, suggest journal and VR
        modulesToPrioritize = modulesToPrioritize.map(module => ({
          ...module,
          priority: module.title.includes("Journal") ? 10 : 
                    module.title.includes("VR") ? 9 : 
                    module.priority
        }));
        break;
      case 'energetic':
        // When energetic, suggest music and coach
        modulesToPrioritize = modulesToPrioritize.map(module => ({
          ...module,
          priority: module.title.includes("Musique") ? 10 : 
                    module.title.includes("Coach") ? 9 : 
                    module.priority
        }));
        break;
      case 'creative':
        // When creative, suggest music and journal
        modulesToPrioritize = modulesToPrioritize.map(module => ({
          ...module,
          priority: module.title.includes("Musique") ? 10 : 
                    module.title.includes("Journal") ? 9 : 
                    module.priority
        }));
        break;
      case 'reflective':
        // When reflective, suggest journal and coach
        modulesToPrioritize = modulesToPrioritize.map(module => ({
          ...module,
          priority: module.title.includes("Journal") ? 10 : 
                    module.title.includes("Coach") ? 9 : 
                    module.priority
        }));
        break;
      case 'anxious':
        // When anxious, suggest scan and VR
        modulesToPrioritize = modulesToPrioritize.map(module => ({
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
    return modulesToPrioritize.sort((a, b) => b.priority - a.priority);
  }, [baseModules, selectedMood]);

  return prioritizedModules;
};
