
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { VRSessionHistoryProps, VRSession } from '@/types/vr';

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ 
  sessions = [],
  userId,
  limit = 5,
  showHeader = true,
  className = ""
}) => {
  // Filter sessions by user if userId is provided
  const userSessions = userId 
    ? sessions.filter(session => session.userId === userId)
    : sessions;
  
  // Limit the number of sessions shown
  const limitedSessions = userSessions.slice(0, limit);

  if (limitedSessions.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <p className="text-muted-foreground">Aucune session récente</p>
      </div>
    );
  }

  const formatSessionDate = (session: VRSession) => {
    const date = session.startedAt || 
                new Date(session.start_time || session.startTime || session.date || Date.now());
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getStatusIndicator = (session: VRSession) => {
    return session.completed || session.completedAt ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
        Terminé
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400">
        Partiel
      </span>
    );
  };

  const getSessionRating = (session: VRSession) => {
    if (!session.feedback?.rating && !session.rating) return null;
    
    const rating = session.feedback?.rating || session.rating;
    return (
      <div className="flex items-center">
        <span className="text-yellow-500">★</span>
        <span className="ml-1 text-sm">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Historique des sessions</h3>
        </div>
      )}
      
      <div className="space-y-2">
        {limitedSessions.map((session) => (
          <div key={session.id} className="p-3 border rounded-lg bg-card">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{session.template?.title || "Session VR"}</h4>
              {getSessionRating(session)}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {formatSessionDate(session)}
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">
                {session.duration} minutes
              </div>
              {getStatusIndicator(session)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VRSessionHistory;
