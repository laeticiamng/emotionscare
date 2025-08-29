import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Play } from 'lucide-react';

const B2CVRPage: React.FC = () => {
  const navigate = useNavigate();

  const vrEnvironments = [
    { id: '1', name: 'Forêt Enchantée', description: 'Promenade méditative', thumbnail: '🌲' },
    { id: '2', name: 'Océan Infini', description: 'Relaxation océanique', thumbnail: '🌊' },
    { id: '3', name: 'Galaxie Stellaire', description: 'Voyage cosmique', thumbnail: '✨' }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/home')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expériences VR</h1>
            <p className="text-gray-600">Immersion thérapeutique</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {vrEnvironments.map((env) => (
            <Card key={env.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{env.thumbnail}</div>
                <CardTitle>{env.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{env.description}</p>
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

export default B2CVRPage;