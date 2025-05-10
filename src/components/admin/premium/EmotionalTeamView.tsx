
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Smile, Frown, Meh, BarChart } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'stressed' | 'focused';
  intensity: number;
  avatar?: string;
}

interface EmotionalTeamViewProps {
  title?: string;
  teamMembers?: TeamMember[];
}

const EmotionalTeamView: React.FC<EmotionalTeamViewProps> = ({ 
  title = "Climat Émotionnel d'Équipe",
  teamMembers = defaultTeamMembers
}) => {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="h-4 w-4 text-emerald-500" />;
      case 'sad':
        return <Frown className="h-4 w-4 text-rose-500" />;
      case 'stressed':
        return <Frown className="h-4 w-4 text-amber-500" />;
      case 'focused':
        return <BarChart className="h-4 w-4 text-indigo-500" />;
      case 'neutral':
      default:
        return <Meh className="h-4 w-4 text-slate-500" />;
    }
  };

  const emotionCounts = teamMembers.reduce((acc, member) => {
    acc[member.emotion] = (acc[member.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMembers = teamMembers.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
            <Smile className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
            <div className="text-xs">Heureux</div>
            <div className="text-lg font-semibold">{Math.round((emotionCounts.happy || 0) / totalMembers * 100)}%</div>
          </div>
          <div className="text-center p-2 bg-rose-50 dark:bg-rose-950/30 rounded-md">
            <Frown className="h-5 w-5 mx-auto mb-1 text-rose-500" />
            <div className="text-xs">Triste</div>
            <div className="text-lg font-semibold">{Math.round((emotionCounts.sad || 0) / totalMembers * 100)}%</div>
          </div>
          <div className="text-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
            <Frown className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <div className="text-xs">Stressé</div>
            <div className="text-lg font-semibold">{Math.round((emotionCounts.stressed || 0) / totalMembers * 100)}%</div>
          </div>
          <div className="text-center p-2 bg-slate-50 dark:bg-slate-950/30 rounded-md">
            <Meh className="h-5 w-5 mx-auto mb-1 text-slate-500" />
            <div className="text-xs">Neutre</div>
            <div className="text-lg font-semibold">{Math.round((emotionCounts.neutral || 0) / totalMembers * 100)}%</div>
          </div>
        </div>

        <div className="space-y-2">
          {teamMembers.slice(0, 5).map(member => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="rounded-full w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getEmotionIcon(member.emotion)}
                <div className="w-16 h-2 bg-muted rounded-full ml-2">
                  <div 
                    className={`h-full rounded-full ${
                      member.emotion === 'happy' ? 'bg-emerald-500' :
                      member.emotion === 'sad' ? 'bg-rose-500' :
                      member.emotion === 'stressed' ? 'bg-amber-500' :
                      member.emotion === 'focused' ? 'bg-indigo-500' :
                      'bg-slate-500'
                    }`} 
                    style={{ width: `${member.intensity}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const defaultTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Martin', role: 'Designer', emotion: 'happy', intensity: 85 },
  { id: '2', name: 'Thomas Durand', role: 'Développeur', emotion: 'stressed', intensity: 70 },
  { id: '3', name: 'Emilie Roux', role: 'Product Manager', emotion: 'focused', intensity: 90 },
  { id: '4', name: 'Lucas Petit', role: 'Marketing', emotion: 'neutral', intensity: 50 },
  { id: '5', name: 'Julie Leroy', role: 'Customer Support', emotion: 'sad', intensity: 60 },
  { id: '6', name: 'Antoine Dupont', role: 'Développeur', emotion: 'happy', intensity: 75 },
  { id: '7', name: 'Sophie Moreau', role: 'UX Researcher', emotion: 'neutral', intensity: 55 },
];

export default EmotionalTeamView;
