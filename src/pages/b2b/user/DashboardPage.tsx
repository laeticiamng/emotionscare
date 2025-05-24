
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scan, Music, MessageCircle } from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Utilisateur B2B</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/user/scan')}>
          <CardHeader>
            <Scan className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Scan Émotionnel</CardTitle>
            <CardDescription>Analysez votre état émotionnel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Commencer un scan</Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/user/music')}>
          <CardHeader>
            <Music className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Musicothérapie</CardTitle>
            <CardDescription>Musique adaptée à vos émotions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Écouter de la musique</Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/user/coach')}>
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Coach IA</CardTitle>
            <CardDescription>Assistance personnalisée</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Parler au coach</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
