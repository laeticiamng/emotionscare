// @ts-nocheck

// @ts-nocheck
import React from 'react';
import { VRSession, VRSessionTemplate } from '@/types/vr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { durationToNumber, formatDuration } from './utils';

interface VRSessionsListProps {
  sessions?: VRSession[];
  templates?: VRSessionTemplate[];
  onSessionSelect?: (session: VRSession) => void;
  onTemplateSelect?: (template: VRSessionTemplate) => void;
  emptyMessage?: string;
  title?: string;
  limitDisplay?: number;
  className?: string;
}

const VRSessionsList: React.FC<VRSessionsListProps> = ({
  sessions = [],
  templates = [],
  onSessionSelect,
  onTemplateSelect,
  emptyMessage = "Aucune session disponible",
  title = "Sessions VR",
  limitDisplay,
  className = "",
}) => {
  // Helper function to find template for a session
  const findTemplateForSession = (session: VRSession): VRSessionTemplate | undefined => {
    return templates.find(t => t.id === session.templateId);
  };

  // Filter and limit sessions to display
  const displaySessions = limitDisplay ? sessions.slice(0, limitDisplay) : sessions;
  
  // Sort templates by duration (shortest first)
  const sortedTemplates = [...templates].sort((a, b) => {
    const durationA = durationToNumber(a.duration);
    const durationB = durationToNumber(b.duration);
    return durationA - durationB;
  });
  
  // Filter and limit templates to display
  const displayTemplates = limitDisplay ? sortedTemplates.slice(0, limitDisplay) : sortedTemplates;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {displaySessions.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium">Sessions récentes</h3>
            <div className="grid grid-cols-1 gap-3">
              {displaySessions.map((session) => {
                const template = findTemplateForSession(session);
                return (
                  <div
                    key={session.id}
                    className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-accent"
                    onClick={() => onSessionSelect && onSessionSelect(session)}
                  >
                    <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center mr-3">
                      <span className="text-lg">🧘</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{template?.title || "Session sans titre"}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.startTime).toLocaleDateString()}
                        {" • "}
                        {formatDuration(template?.duration)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {displayTemplates.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Sessions recommandées</h3>
            <div className="grid grid-cols-1 gap-3">
              {displayTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-accent"
                  onClick={() => onTemplateSelect && onTemplateSelect(template)}
                >
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-lg">{template.category === "meditation" ? "🧘" : "🌿"}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {template.difficulty} • {formatDuration(template.duration)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionsList;
