
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Heart, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const UnifiedEmotionCheckin: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { id: 'great', emoji: '😊', label: 'Excellent', color: 'text-green-600', score: 90 },
    { id: 'good', emoji: '🙂', label: 'Bien', color: 'text-blue-600', score: 75 },
    { id: 'okay', emoji: '😐', label: 'Correct', color: 'text-yellow-600', score: 60 },
    { id: 'bad', emoji: '😔', label: 'Difficile', color: 'text-orange-600', score: 40 },
    { id: 'terrible', emoji: '😢', label: 'Très dur', color: 'text-red-600', score: 20 }
  ];

  const intensities = [1, 2, 3, 4, 5];

  const recentCheckins = [
    { time: 'Il y a 2h', mood: '😊', score: 85, note: 'Excellente réunion équipe' },
    { time: 'Hier', mood: '😐', score: 65, note: 'Journée chargée mais productive' },
    { time: 'Avant-hier', mood: '🙂', score: 78, note: 'Bonne séance de sport le matin' }
  ];

  const handleQuickCheckin = async () => {
    if (!selectedMood) {
      toast.error("Veuillez sélectionner votre humeur");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedMoodData = moods.find(m => m.id === selectedMood);
      const finalScore = selectedMoodData ? selectedMoodData.score + (selectedIntensity ? (selectedIntensity - 3) * 5 : 0) : 60;
      
      toast.success(`Check-in enregistré ! Score: ${finalScore}%`);
      setSelectedMood(null);
      setSelectedIntensity(null);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Check-in Rapide
          </CardTitle>
          <CardDescription>
            Comment vous sentez-vous maintenant ? Une évaluation rapide en quelques clics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Comment vous sentez-vous ?</p>
            <div className="flex flex-wrap gap-3">
              {moods.map((mood) => (
                <Button
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={`flex flex-col items-center p-4 h-auto ${selectedMood === mood.id ? '' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Intensité (optionnel)</p>
              <div className="flex gap-2">
                {intensities.map((intensity) => (
                  <Button
                    key={intensity}
                    variant={selectedIntensity === intensity ? "default" : "outline"}
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setSelectedIntensity(intensity)}
                  >
                    {intensity}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                1 = Léger, 5 = Très intense
              </p>
            </div>
          )}

          <Button 
            onClick={handleQuickCheckin}
            disabled={!selectedMood || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer mon état'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Check-ins Récents
          </CardTitle>
          <CardDescription>
            Historique de vos derniers check-ins rapides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCheckins.map((checkin, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{checkin.mood}</span>
                  <div>
                    <p className="text-sm font-medium">{checkin.note}</p>
                    <p className="text-xs text-muted-foreground">{checkin.time}</p>
                  </div>
                </div>
                <Badge variant="secondary">{checkin.score}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Tendance de la Semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">78%</p>
              <p className="text-xs text-muted-foreground">Score moyen</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-xs text-muted-foreground">Check-ins</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">+5%</p>
              <p className="text-xs text-muted-foreground">Amélioration</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-xs text-muted-foreground">Jours consécutifs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedEmotionCheckin;
