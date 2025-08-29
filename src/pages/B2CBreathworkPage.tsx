import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wind, Play } from 'lucide-react';

const B2CBreathworkPage: React.FC = () => {
  const navigate = useNavigate();

  const techniques = [
    { id: '1', name: 'Respiration 4-7-8', description: 'Technique apaisante', icon: '🌙' },
    { id: '2', name: 'Box Breathing', description: 'Respiration carrée', icon: '⚡' },
    { id: '3', name: 'Cohérence Cardiaque', description: 'Synchronisation cardiaque', icon: '💚' }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Respiration Thérapeutique</h1>
            <p className="text-gray-600">Techniques de bien-être</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {techniques.map((technique) => (
            <Card key={technique.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">{technique.icon}</div>
                <CardTitle>{technique.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{technique.description}</p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default B2CBreathworkPage;