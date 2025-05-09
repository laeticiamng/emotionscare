
import React, { useState, useEffect } from 'react';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BuddyProps {
  id: string;
  name: string;
  interests: string[];
  compatibility?: number;
}

const mockBuddies: BuddyProps[] = [
  { id: '1', name: 'Sophie', interests: ['méditation', 'yoga', 'lecture'], compatibility: 85 },
  { id: '2', name: 'Thomas', interests: ['sport', 'musique', 'cuisine'], compatibility: 72 },
  { id: '3', name: 'Emilie', interests: ['voyage', 'photographie', 'arts'], compatibility: 68 },
  { id: '4', name: 'Lucas', interests: ['technologie', 'gaming', 'cinéma'], compatibility: 91 }
];

const BuddyPage: React.FC = () => {
  const [buddies, setBuddies] = useState<BuddyProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBuddies(mockBuddies);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Trouvez un Buddy</h1>
        <p className="text-muted-foreground">
          Connectez-vous avec des collègues qui partagent des intérêts similaires
          pour échanger sur le bien-être émotionnel
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {buddies.map((buddy) => (
            <Card key={buddy.id} className="overflow-hidden">
              <CardHeader className="bg-secondary flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mb-2">
                  {buddy.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold">{buddy.name}</h3>
                {buddy.compatibility && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {buddy.compatibility}% compatible
                  </span>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Intérêts:</h4>
                  <div className="flex flex-wrap gap-1">
                    {buddy.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Se connecter</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
