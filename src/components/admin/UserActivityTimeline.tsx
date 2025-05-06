
import React from 'react';
import { Calendar, FileText, Key, UserPen } from 'lucide-react'; // Using approved icons from lucide-react
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineContent,
  TimelineBody
} from '@/components/ui/timeline';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: 'connexion' | 'consultation' | 'inscription_event' | 'modification_profil' | 'questionnaire_reponse';
  activity_details?: Record<string, any>;
  timestamp: string;
  user_ip?: string;
}

interface UserActivityTimelineProps {
  logs: ActivityLog[];
  isLoading?: boolean;
}

const getActivityIcon = (type: ActivityLog['activity_type']) => {
  switch (type) {
    case 'connexion':
      return <Key className="h-4 w-4" />;
    case 'consultation':
      return <Calendar className="h-4 w-4" />;
    case 'inscription_event':
      return <Calendar className="h-4 w-4" />;
    case 'modification_profil':
      return <UserPen className="h-4 w-4" />;
    case 'questionnaire_reponse':
      return <FileText className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getActivityTitle = (type: ActivityLog['activity_type']) => {
  switch (type) {
    case 'connexion':
      return 'Connexion à la plateforme';
    case 'consultation':
      return 'Consultation d\'activités bien-être';
    case 'inscription_event':
      return 'Participation ou inscription à une activité';
    case 'modification_profil':
      return 'Modification du profil utilisateur';
    case 'questionnaire_reponse':
      return 'Réponses aux questionnaires ou évaluations';
    default:
      return 'Activité utilisateur';
  }
};

const UserActivityTimeline: React.FC<UserActivityTimelineProps> = ({ logs, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucune activité n'a été enregistrée pour cet utilisateur.
      </div>
    );
  }

  return (
    <Timeline className="max-w-xl mx-auto">
      {logs.map((log) => (
        <TimelineItem key={log.id}>
          <TimelineHeader>
            <TimelineIcon>
              {getActivityIcon(log.activity_type)}
            </TimelineIcon>
            <TimelineTitle>{getActivityTitle(log.activity_type)}</TimelineTitle>
            <Badge variant="outline" className="ml-auto">
              {format(new Date(log.timestamp), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </Badge>
          </TimelineHeader>
          <TimelineContent>
            <TimelineBody>
              {log.activity_details?.description && (
                <p>{log.activity_details.description}</p>
              )}
              
              {log.user_ip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground cursor-help underline underline-offset-2">
                        Détails additionnels
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>IP: {log.user_ip}</p>
                      {log.activity_details && Object.entries(log.activity_details)
                        .filter(([key]) => key !== 'description')
                        .map(([key, value]) => (
                          <p key={key}>{key}: {String(value)}</p>
                        ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </TimelineBody>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default UserActivityTimeline;
