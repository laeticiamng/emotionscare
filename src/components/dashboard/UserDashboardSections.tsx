
import React from 'react';
import { VRSessionTemplate } from '@/types/vr';

const UserDashboardSections: React.FC = () => {
  // Mock data for VR sessions
  const recommendedSessions: VRSessionTemplate[] = [
    {
      id: '1',
      title: 'Méditation matinale',
      description: 'Commencez votre journée avec une méditation guidée pour un esprit clair',
      duration: 15,
      tags: ['méditation', 'matin', 'débutant'],
      category: 'méditation',
      environment: 'plage',
      thumbnailUrl: '/images/meditation-morning.jpg',
      emotionTarget: 'calme'
    },
    {
      id: '2',
      title: 'Relaxation profonde',
      description: 'Une session immersive pour libérer le stress et retrouver l\'équilibre',
      duration: 25,
      tags: ['relaxation', 'stress', 'soir'],
      category: 'relaxation',
      environment: 'forêt',
      thumbnailUrl: '/images/deep-relaxation.jpg',
      emotionTarget: 'sérénité'
    }
  ];

  // Content rendering
  return (
    <div className="space-y-8">
      <h2>User Dashboard Sections</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Sessions recommandées</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedSessions.map(session => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="aspect-video bg-gray-200 mb-3 rounded">
                {session.thumbnailUrl && (
                  <img 
                    src={session.thumbnailUrl} 
                    alt={session.title}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <h4 className="font-medium">{session.title}</h4>
              <p className="text-sm text-muted-foreground">{session.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {session.duration} min
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {session.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSections;
