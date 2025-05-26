
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Mic } from 'lucide-react';

const UnifiedEmotionCheckin: React.FC = () => {
  const [checkinText, setCheckinText] = useState('');
  const [checkinType, setCheckinType] = useState<'quick' | 'detailed'>('quick');

  const quickEmotions = [
    { emoji: '😊', label: 'Heureux', color: 'bg-green-100' },
    { emoji: '😐', label: 'Neutre', color: 'bg-gray-100' },
    { emoji: '😢', label: 'Triste', color: 'bg-blue-100' },
    { emoji: '😠', label: 'Énervé', color: 'bg-red-100' },
    { emoji: '😴', label: 'Fatigué', color: 'bg-purple-100' },
  ];

  const handleQuickEmotion = (emotion: string) => {
    console.log('Quick emotion selected:', emotion);
  };

  const handleDetailedCheckin = () => {
    if (checkinText.trim()) {
      console.log('Detailed checkin:', checkinText);
      setCheckinText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <Button
          variant={checkinType === 'quick' ? 'default' : 'outline'}
          onClick={() => setCheckinType('quick')}
          size="sm"
        >
          <Heart className="w-4 h-4 mr-2" />
          Check-in rapide
        </Button>
        <Button
          variant={checkinType === 'detailed' ? 'default' : 'outline'}
          onClick={() => setCheckinType('detailed')}
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Check-in détaillé
        </Button>
      </div>

      {checkinType === 'quick' ? (
        <Card>
          <CardHeader>
            <CardTitle>Comment vous sentez-vous maintenant ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {quickEmotions.map((emotion) => (
                <button
                  key={emotion.label}
                  onClick={() => handleQuickEmotion(emotion.label)}
                  className={`${emotion.color} p-4 rounded-lg text-center hover:opacity-80 transition-opacity`}
                >
                  <div className="text-2xl mb-2">{emotion.emoji}</div>
                  <div className="text-sm font-medium">{emotion.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Partagez vos ressentis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Décrivez comment vous vous sentez aujourd'hui..."
              value={checkinText}
              onChange={(e) => setCheckinText(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleDetailedCheckin} disabled={!checkinText.trim()}>
                Enregistrer
              </Button>
              <Button variant="outline" size="icon">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnifiedEmotionCheckin;
