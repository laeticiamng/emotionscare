import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from '@/components/feedback/FeedbackForm';

interface EvaluationDashboardProps {
  module?: string;
}

const EvaluationDashboard: React.FC<EvaluationDashboardProps> = ({ module }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluation et feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <FeedbackForm module={module} />
      </CardContent>
    </Card>
  );
};

export default EvaluationDashboard;
