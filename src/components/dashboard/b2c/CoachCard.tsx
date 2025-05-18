import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CoachCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/10 dark:to-orange-900/20 border-amber-100 dark:border-amber-900/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-amber-500" />
          Coach IA personnel
        </CardTitle>
        <CardDescription>Suggestion personnalisée du jour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 border border-amber-200 dark:border-amber-800/50 rounded-lg bg-white/60 dark:bg-black/20">
          <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Respiration guidée</h4>
          <p className="text-sm">Une séance de 5 minutes pour vous aider à conserver votre calme et rester concentré.</p>
          <Button variant="link" className="p-0 h-auto text-amber-600 dark:text-amber-400 mt-1" onClick={() => navigate('/b2c/coach')}>
            Commencer maintenant →
          </Button>
        </div>
        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none" onClick={() => navigate('/b2c/coach-chat')}>
          Parler à mon coach
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoachCard;
