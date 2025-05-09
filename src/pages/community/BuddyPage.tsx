
import React from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import BuddyCard from '@/components/community/BuddyCard';

const buddies = [
  {
    id: '1',
    name: 'Alex Martin',
    department: 'Marketing',
    interests: ['Méditation', 'Yoga', 'Lecture'],
    compatibility: 87,
    avatar: '/avatars/avatar-1.png'
  },
  {
    id: '2',
    name: 'Samantha Chen',
    department: 'Développement',
    interests: ['Musique', 'Pleine conscience', 'Randonnée'],
    compatibility: 92,
    avatar: '/avatars/avatar-2.png'
  },
  {
    id: '3',
    name: 'Thomas Dubois',
    department: 'Design',
    interests: ['Méditation', 'Art', 'Nature'],
    compatibility: 78,
    avatar: '/avatars/avatar-3.png'
  },
  {
    id: '4',
    name: 'Maria Rodriguez',
    department: 'Ressources Humaines',
    interests: ['Bien-être', 'Cuisine', 'Cyclisme'],
    compatibility: 85,
    avatar: '/avatars/avatar-4.png'
  }
];

const BuddyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Programme Buddy</h1>
        <p className="text-muted-foreground mt-2">
          Connectez-vous avec des collègues qui partagent des intérêts similaires pour échanger sur le bien-être émotionnel.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {buddies.map(buddy => (
          <BuddyCard key={buddy.id} buddy={buddy} />
        ))}
      </div>
    </div>
  );
};

export default function WrappedBuddyPage() {
  return (
    <ProtectedLayoutWrapper>
      <BuddyPage />
    </ProtectedLayoutWrapper>
  );
}
