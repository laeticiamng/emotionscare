import React from 'react';
import EvaluationDashboard from '@/components/evaluation/EvaluationDashboard';

const B2BUserEvaluationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <EvaluationDashboard module="b2b_user" />
    </div>
  );
};

export default B2BUserEvaluationPage;
