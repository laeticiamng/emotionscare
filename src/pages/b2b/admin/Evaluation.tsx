import React from 'react';
import EvaluationDashboard from '@/components/evaluation/EvaluationDashboard';

const B2BAdminEvaluationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <EvaluationDashboard module="b2b_admin" />
    </div>
  );
};

export default B2BAdminEvaluationPage;
