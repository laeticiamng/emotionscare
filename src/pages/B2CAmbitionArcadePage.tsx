import React, { useState } from 'react';
import { ArrowLeft, Target, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface DailyCard {
  id: string;
  text: string;
  completed: boolean;
  type: 'gesture' | 'decision' | 'micro_action';
}

interface Ambition {
  id: string;
  title: string;
  dailyCards: DailyCard[];
  createdAt: Date;
}

const B2CAmbitionArcadePage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate, getDuration } = useMotionPrefs();
  const [currentGoal, setCurrentGoal] = useState('');
  const [showCardCreation, setShowCardCreation] = useState(false);
  const [selectedAmbition, setSelectedAmbition] = useState<Ambition | null>(null);

  const [ambitions] = useState<Ambition[]>([
    {
      id: '1',
      title: 'Mieux dormir',
      dailyCards: [
        { id: '1', text: 'Éteindre les écrans 30min avant', completed: false, type: 'gesture' },
        { id: '2', text: 'Noter 3 bonnes choses du jour', completed: false, type: 'micro_action' }
      ],
      createdAt: new Date()
    }
  ]);

  const todaysCards: DailyCard[] = selectedAmbition?.dailyCards || [
    { id: 'today1', text: 'Respirer 3 fois avant de consulter le téléphone', completed: false, type: 'gesture' },
    { id: 'today2', text: 'Boire un verre d\'eau en arrivant au bureau', completed: true, type: 'micro_action' },
    { id: 'today3', text: 'Prendre 5 min pour organiser demain', completed: false, type: 'decision' }
  ];

  const [cards, setCards] = useState<DailyCard[]>(todaysCards);

  const generateDailyCards = (goal: string) => {
    // Simulation de la génération OpenAI
    const mockCards: DailyCard[] = [
      {
        id: Date.now().toString() + '1',
        text: `Identifier un petit pas vers "${goal}"`,
        completed: false,
        type: 'decision'
      },
      {
        id: Date.now().toString() + '2', 
        text: `Consacrer 5 min à "${goal}" maintenant`,
        completed: false,
        type: 'micro_action'
      },
      {
        id: Date.now().toString() + '3',
        text: `Visualiser le succès de "${goal}" en 30 secondes`,
        completed: false,
        type: 'gesture'
      }
    ];
    
    setCards(mockCards);
    setShowCardCreation(false);
    setCurrentGoal('');
  };

  const toggleCard = (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, completed: !card.completed }
        : card
    ));

    // Animation de validation avec son "clic" satisfaisant
    if (shouldAnimate) {
      const duration = getDuration(400);
      // Effet de validation papier texturé
    }
  };

  const getCardIcon = (type: DailyCard['type']) => {
    switch (type) {
      case 'gesture': return '🤲';
      case 'decision': return '🎯'; 
      case 'micro_action': return '⚡';
      default: return '📝';
    }
  };

  const completedCount = cards.filter(card => card.completed).length;
  const progress = cards.length > 0 ? (completedCount / cards.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ambition Arcade</h1>
          <p className="text-sm text-muted-foreground">Un pas aujourd'hui</p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Progression du jour */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-foreground">Aujourd'hui</h2>
            <span className="text-sm text-muted-foreground">{completedCount}/{cards.length}</span>
          </div>
          
          <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-primary/60 to-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {progress === 100 && (
            <div className="text-center mt-3">
              <span className="text-sm text-primary">✨ Ça compte ! ✨</span>
            </div>
          )}
        </Card>

        {/* Cartes du jour */}
        <div className="space-y-3">
          {cards.map((card) => (
            <Card 
              key={card.id}
              className={`p-4 border-border/50 transition-all duration-300 cursor-pointer group ${
                card.completed 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-card/60 backdrop-blur-sm hover:bg-card/80'
              }`}
              onClick={() => toggleCard(card.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {card.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/40 group-hover:border-primary/60 transition-colors" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{getCardIcon(card.type)}</span>
                    <span className="text-xs text-muted-foreground capitalize">{card.type.replace('_', ' ')}</span>
                  </div>
                  <p className={`text-sm ${
                    card.completed 
                      ? 'text-muted-foreground line-through' 
                      : 'text-foreground group-hover:text-primary'
                  } transition-colors`}>
                    {card.text}
                  </p>
                </div>

                {!card.completed && (
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Fait
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Créer un nouvel objectif */}
        {!showCardCreation ? (
          <Card className="p-4 bg-card/40 backdrop-blur-sm border-border/30">
            <Button 
              onClick={() => setShowCardCreation(true)}
              variant="ghost" 
              className="w-full h-auto p-4 flex items-center gap-3 hover:bg-white/5"
            >
              <Target className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">Nouvel objectif</p>
                <p className="text-xs text-muted-foreground">Découper en micro-leviers</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </Button>
          </Card>
        ) : (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Quel est votre objectif ?</h3>
              <Input
                placeholder="Ex: Mieux gérer mon stress"
                value={currentGoal}
                onChange={(e) => setCurrentGoal(e.target.value)}
                className="bg-background/50"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateDailyCards(currentGoal)}
                  disabled={!currentGoal.trim()}
                  className="flex-1"
                >
                  Créer mes cartes
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCardCreation(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Planification demain */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Demain</p>
              <p className="text-xs text-muted-foreground">Vos cartes vous attendent</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default B2CAmbitionArcadePage;