/**
 * AssessPage - Centre des Évaluations Cliniques
 * Accès aux 11 instruments psychométriques validés
 */

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ClipboardList, Brain, Heart, Activity, Moon, Shield, Smile } from 'lucide-react';

const INSTRUMENTS = [
  { id: 'WHO5', name: 'WHO-5', description: 'Bien-être général (OMS)', icon: Smile, color: 'bg-green-500', items: 5 },
  { id: 'PHQ9', name: 'PHQ-9', description: 'Dépression', icon: Heart, color: 'bg-blue-500', items: 9 },
  { id: 'GAD7', name: 'GAD-7', description: 'Anxiété généralisée', icon: Activity, color: 'bg-purple-500', items: 7 },
  { id: 'PSS10', name: 'PSS-10', description: 'Stress perçu', icon: Brain, color: 'bg-orange-500', items: 10 },
  { id: 'STAI6', name: 'STAI-6', description: 'Anxiété état/trait', icon: Activity, color: 'bg-red-500', items: 6 },
  { id: 'SAM', name: 'SAM', description: 'Affect visuel', icon: Smile, color: 'bg-pink-500', items: 3 },
  { id: 'SUDS', name: 'SUDS', description: 'Détresse subjective', icon: Activity, color: 'bg-yellow-500', items: 1 },
  { id: 'AAQ2', name: 'AAQ-II', description: 'Flexibilité psychologique', icon: Brain, color: 'bg-teal-500', items: 7 },
  { id: 'ISI', name: 'ISI', description: 'Insomnie', icon: Moon, color: 'bg-indigo-500', items: 7 },
  { id: 'BRS', name: 'BRS', description: 'Résilience', icon: Shield, color: 'bg-emerald-500', items: 6 },
  { id: 'PANAS', name: 'PANAS', description: 'Affects positifs/négatifs', icon: Heart, color: 'bg-rose-500', items: 20 },
];

export default function AssessPage() {
  const [searchParams] = useSearchParams();
  const selectedInstrument = searchParams.get('instrument');

  if (selectedInstrument) {
    const instrument = INSTRUMENTS.find(i => i.id === selectedInstrument);
    if (instrument) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-2xl" data-testid="page-root">
          <Link to="/app/assess" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour aux évaluations
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${instrument.color} text-white`}>
                  <instrument.icon className="h-5 w-5" />
                </div>
                {instrument.name}
              </CardTitle>
              <CardDescription>{instrument.description} • {instrument.items} questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cette évaluation vous aidera à mesurer votre {instrument.description.toLowerCase()}.
                Répondez honnêtement aux questions suivantes.
              </p>
              <Button className="w-full" size="lg">
                Commencer l'évaluation
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="page-root">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-primary/10">
          <ClipboardList className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Évaluations Cliniques</h1>
          <p className="text-muted-foreground">11 instruments psychométriques validés scientifiquement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INSTRUMENTS.map((instrument) => (
          <Link key={instrument.id} to={`/app/assess?instrument=${instrument.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${instrument.color} text-white`}>
                    <instrument.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{instrument.items} Q</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {instrument.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{instrument.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
