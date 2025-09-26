import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Filter, TrendingUp, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données mockées pour l'historique des scans
const mockScanHistory = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    emotion: 'Joie',
    confidence: 87,
    color: 'bg-yellow-100 text-yellow-800',
    notes: 'Session après une bonne nouvelle'
  },
  {
    id: 2,
    date: '2024-01-14',
    time: '09:15',
    emotion: 'Calme',
    confidence: 92,
    color: 'bg-blue-100 text-blue-800',
    notes: 'Méditation matinale'
  },
  {
    id: 3,
    date: '2024-01-13',
    time: '18:45',
    emotion: 'Stress',
    confidence: 78,
    color: 'bg-red-100 text-red-800',
    notes: 'Fin de journée chargée'
  },
  {
    id: 4,
    date: '2024-01-12',
    time: '12:00',
    emotion: 'Neutre',
    confidence: 85,
    color: 'bg-gray-100 text-gray-800',
    notes: 'Pause déjeuner'
  }
];

export default function ScanHistoryPage() {
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all' 
    ? mockScanHistory 
    : mockScanHistory.filter(scan => scan.emotion.toLowerCase() === filter);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historique des Scans Émotionnels
          </h1>
          <p className="text-gray-600">
            Consultez l'évolution de vos émotions au fil du temps
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Tout voir
          </Button>
          <Button
            variant={filter === 'joie' ? 'default' : 'outline'}
            onClick={() => setFilter('joie')}
            size="sm"
          >
            Joie
          </Button>
          <Button
            variant={filter === 'calme' ? 'default' : 'outline'}
            onClick={() => setFilter('calme')}
            size="sm"
          >
            Calme
          </Button>
          <Button
            variant={filter === 'stress' ? 'default' : 'outline'}
            onClick={() => setFilter('stress')}
            size="sm"
          >
            Stress
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Total Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{mockScanHistory.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Émotion dominante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-purple-600">Calme</p>
            </CardContent>
          </Card>
        </div>

        {/* Historique des scans */}
        <div className="space-y-4">
          {filteredHistory.map((scan) => (
            <Card key={scan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={scan.color}>
                        {scan.emotion}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {scan.date} à {scan.time}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        Confiance: {scan.confidence}%
                      </span>
                    </div>
                    {scan.notes && (
                      <p className="text-gray-600 text-sm">{scan.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun scan trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                Aucun scan ne correspond aux filtres sélectionnés
              </p>
              <Button asChild>
                <Link to="/app/scan">Nouveau Scan</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild>
            <Link to="/app/scan">
              <Camera className="h-4 w-4 mr-2" />
              Nouveau Scan
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/home">Retour au dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}