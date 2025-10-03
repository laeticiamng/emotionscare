
import React from 'react';

const MoodChartFooter: React.FC = () => {
  return (
    <div className="mt-6 text-center text-sm text-muted-foreground">
      <p>Ces données sont générées à partir de l'analyse de vos entrées de journal.</p>
      <p>Plus vous écrivez régulièrement, plus les tendances seront précises.</p>
    </div>
  );
};

export default MoodChartFooter;
