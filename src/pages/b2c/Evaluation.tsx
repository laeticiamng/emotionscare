import React from 'react';
import EvaluationDashboard from '@/components/evaluation/EvaluationDashboard';

const B2CEvaluationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <EvaluationDashboard module="b2c" />
    </div>
  );
};

export default B2CEvaluationPage;
