import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MiniCoach from '@/components/coach/MiniCoach';

const CoachAssistant: React.FC = () => {
  // Sample quick questions
  const quickQuestions = [
    "Comment me sentir mieux ?",
    "Je me sens stressé(e)",
    "Exercice de respiration"
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Assistant Coach</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-full">
        <MiniCoach quickQuestions={quickQuestions} />
      </CardContent>
    </Card>
  );
};

export default CoachAssistant;
